import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';

export async function extractTextFromFile(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const dataBuffer = await fs.readFile(filePath);

    if (ext === '.pdf') {
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value;
    } else if (ext === '.doc') {
      // .doc files are binary format, harder to parse without additional libraries
      // For now, return a message
      throw new Error('DOC files are not supported. Please convert to PDF or DOCX format.');
    } else {
      // Try to read as plain text
      return dataBuffer.toString('utf-8');
    }
  } catch (error) {
    console.error('File Parsing Error:', error);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
}

