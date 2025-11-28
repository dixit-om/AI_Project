import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResumeService } from '../../services/resume.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-resume-upload',
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-upload.html',
  styleUrl: './resume-upload.css',
})
export class ResumeUpload {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  error: string | null = null;

  constructor(
    private resumeService: ResumeService,
    private router: Router
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.error = null;
    }
  }

  triggerFileInput() {
    this.fileInput?.nativeElement?.click();
  }

  async uploadResume() {
    if (!this.selectedFile) {
      this.error = 'Please select a file';
      return;
    }

    // Validate file type by extension (more reliable than MIME type)
    const fileName = this.selectedFile.name.toLowerCase();
    const allowedExtensions = ['.pdf', '.docx'];
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      this.error = 'Please upload a PDF or DOCX document. DOC files are not supported.';
      return;
    }

    // Validate file size (10MB)
    if (this.selectedFile.size > 10 * 1024 * 1024) {
      this.error = 'File size must be less than 10MB';
      return;
    }

    this.isUploading = true;
    this.error = null;
    this.uploadProgress = 0;

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        if (this.uploadProgress < 90) {
          this.uploadProgress += 10;
        }
      }, 200);

      const response: any = await firstValueFrom(this.resumeService.uploadResume(this.selectedFile, 'user1'));
      
      clearInterval(progressInterval);
      this.uploadProgress = 100;

      // Navigate to analysis results
      setTimeout(() => {
        this.router.navigate(['/analysis', response.resumeId]);
      }, 500);
    } catch (error: any) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload resume. Please try again.';
      
      if (error.error) {
        if (typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error.error) {
          errorMessage = error.error.error;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.error = errorMessage;
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.error = null;
  }
}

