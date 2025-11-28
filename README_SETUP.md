# AI Resume Analyzer - Setup Guide

## Project Overview
This is an AI-powered resume analysis application that:
- Uploads and parses resumes (PDF/Word)
- Analyzes resumes using AI (OpenAI GPT)
- Provides ATS scores, skills analysis, strengths/weaknesses, and recommendations
- Stores data in MongoDB

## Backend Setup

### 1. Navigate to server directory
```bash
cd server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
A `.env` file template is available in the `server` directory. Create a `.env` file with your credentials:
```env
MONGODB_URI=mongodb+srv://omdixit2826_db_user:nYwfI15cAUkFQevG@resumeanalyzer.mqeohwl.mongodb.net/resume_analyzer?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
```

**Important:** 
- The MongoDB connection string is already configured with your credentials
- Add your OpenAI API key to enable AI resume analysis
- The database name is set to `resume_analyzer` - it will be created automatically if it doesn't exist

### 4. Start the backend server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:3000`

## Frontend Setup

### 1. Install dependencies (if not already done)
```bash
npm install
```

### 2. Start the Angular development server
```bash
npm start
# or
ng serve
```

The frontend will run on `http://localhost:4200`

## Features

### 1. **Resume Upload** (`/upload`)
- Drag & drop or click to upload PDF/Word documents
- File validation (max 10MB)
- Real-time upload progress

### 2. **Dashboard** (`/dashboard`)
- View all uploaded resumes
- Quick stats (total resumes, average ATS score, total skills)
- Click any resume card to view detailed analysis

### 3. **Resume Analysis** (`/analysis/:id`)
- **ATS Score**: Visual score with color-coded rating
- **Skills Analysis**: Categorized skills with proficiency and relevance scores
- **Strengths & Weaknesses**: Key insights
- **Recommendations**: Actionable advice to improve resume
- **Experience & Education**: Extracted details
- **Certifications & Languages**: All credentials listed
- **Professional Summary**: AI-generated summary

## API Endpoints

- `POST /api/resumes/upload` - Upload and analyze resume
- `GET /api/resumes/user/:userId` - Get all resumes for a user
- `GET /api/resumes/:resumeId` - Get specific resume analysis
- `DELETE /api/resumes/:resumeId` - Delete a resume
- `GET /api/health` - Health check

## Tech Stack

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- OpenAI API (GPT-4o-mini)
- Multer (file uploads)
- pdf-parse (PDF text extraction)

### Frontend
- Angular 20
- TypeScript
- RxJS
- Modern CSS with gradients and animations

## Notes

- The AI analysis uses OpenAI's GPT-4o-mini model
- If OpenAI API key is not provided, the system will return mock data
- Resume files are stored in `server/uploads/` directory
- MongoDB connection string should include your actual password

## Troubleshooting

1. **MongoDB Connection Error**: Check your connection string and password
2. **OpenAI API Error**: Verify your API key is correct and has credits
3. **File Upload Fails**: Check file size (max 10MB) and format (PDF/Word only)
4. **CORS Issues**: Backend CORS is configured for `localhost:4200`

