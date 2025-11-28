import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  analysis: {
    atsScore: {
      type: Number,
      min: 0,
      max: 100
    },
    skills: [{
      name: String,
      category: String,
      proficiency: String,
      relevance: Number
    }],
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    experience: {
      years: Number,
      roles: [String],
      industries: [String]
    },
    education: [{
      degree: String,
      institution: String,
      year: String
    }],
    certifications: [String],
    languages: [String],
    summary: String,
    analyzedAt: Date
  },
  rawText: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Resume', resumeSchema);

