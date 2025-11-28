import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResumeAnalysis {
  atsScore: number;
  skills: Skill[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  experience: Experience;
  education: Education[];
  certifications: string[];
  languages: string[];
  summary: string;
  analyzedAt?: Date;
}

export interface Skill {
  name: string;
  category: string;
  proficiency: string;
  relevance: number;
}

export interface Experience {
  years: number;
  roles: string[];
  industries: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Resume {
  _id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  uploadedAt: Date;
  analysis: ResumeAnalysis;
}

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = 'http://localhost:3000/api/resumes';

  constructor(private http: HttpClient) {}

  uploadResume(file: File, userId: string = 'user1'): Observable<any> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userId', userId);
    
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getUserResumes(userId: string): Observable<{ success: boolean; resumes: Resume[] }> {
    return this.http.get<{ success: boolean; resumes: Resume[] }>(`${this.apiUrl}/user/${userId}`);
  }

  getResume(resumeId: string): Observable<{ success: boolean; resume: Resume }> {
    return this.http.get<{ success: boolean; resume: Resume }>(`${this.apiUrl}/${resumeId}`);
  }

  deleteResume(resumeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${resumeId}`);
  }
}

