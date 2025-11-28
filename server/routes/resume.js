import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Resume from '../models/Resume.js';
import { extractTextFromFile } from '../services/pdfParser.js';
import { analyzeResume } from '../services/aiService.js';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} is not allowed. Only PDF and DOCX files are supported.`), false);
    }
  }
});

// Upload and analyze resume
router.post('/upload', (req, res, next) => {
  console.log('📥 Upload request received');
  console.log('Content-Type:', req.headers['content-type']);
  next();
}, upload.single('resume'), handleMulterError, async (req, res) => {
  try {
    console.log('📋 Request details:');
    console.log('- File:', req.file ? req.file.originalname : 'NO FILE');
    console.log('- Body:', req.body);
    console.log('- File size:', req.file ? req.file.size : 'N/A');
    
    if (!req.file) {
      console.error('❌ No file in request');
      console.error('Request body:', req.body);
      console.error('Request headers:', req.headers);
      return res.status(400).json({ error: 'No file uploaded. Please select a PDF or DOCX file.' });
    }

    const userId = req.body.userId || 'anonymous';
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const originalName = req.file.originalname;
    const fileSize = req.file.size;

    console.log(`📄 Processing resume: ${originalName} (${(fileSize / 1024).toFixed(2)} KB)`);

    // Extract text from file
    let resumeText = '';
    try {
      resumeText = await extractTextFromFile(filePath);
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Could not extract text from the file. The file might be corrupted or empty.');
      }
      console.log(`✅ Extracted ${resumeText.length} characters from resume`);
    } catch (error) {
      console.error('❌ Text extraction error:', error);
      // Clean up uploaded file
      await fs.unlink(filePath).catch(() => {});
      return res.status(400).json({ error: error.message || 'Failed to extract text from file' });
    }

    // Analyze resume with AI
    console.log('🤖 Starting AI analysis...');
    let analysis;
    try {
      analysis = await analyzeResume(resumeText);
      console.log('✅ AI analysis completed');
    } catch (error) {
      console.error('❌ AI analysis error:', error);
      // Clean up uploaded file
      await fs.unlink(filePath).catch(() => {});
      return res.status(500).json({ error: 'Failed to analyze resume. Please try again.' });
    }

    // Save to database
    try {
      const resume = new Resume({
        userId,
        fileName,
        originalName,
        filePath,
        fileSize,
        rawText: resumeText,
        analysis: {
          ...analysis,
          analyzedAt: new Date()
        }
      });

      await resume.save();
      console.log(`💾 Resume saved to database with ID: ${resume._id}`);

      res.status(200).json({
        success: true,
        resumeId: resume._id.toString(),
        analysis: resume.analysis,
        message: 'Resume analyzed successfully',
        fileName: originalName
      });
    } catch (error) {
      console.error('❌ Database save error:', error);
      // Clean up uploaded file
      await fs.unlink(filePath).catch(() => {});
      return res.status(500).json({ error: 'Failed to save resume to database' });
    }
  } catch (error) {
    console.error('❌ Upload Error:', error);
    res.status(500).json({ error: error.message || 'Failed to process resume. Please try again.' });
  }
});

// Get all resumes for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.params.userId })
      .sort({ uploadedAt: -1 })
      .select('-rawText -filePath');
    
    res.json({ success: true, resumes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific resume analysis
router.get('/:resumeId', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId)
      .select('-rawText -filePath');
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete resume
router.delete('/:resumeId', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.resumeId);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(resume.filePath);
    } catch (error) {
      console.error('File deletion error:', error);
    }

    await Resume.findByIdAndDelete(req.params.resumeId);
    
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

