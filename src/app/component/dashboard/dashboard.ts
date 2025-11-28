import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ResumeService, Resume } from '../../services/resume.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  resumes: Resume[] = [];
  loading = true;

  constructor(
    private resumeService: ResumeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadResumes();
  }

  loadResumes() {
    this.resumeService.getUserResumes('user1').subscribe({
      next: (response) => {
        this.resumes = response.resumes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading resumes:', err);
        this.loading = false;
      }
    });
  }

  viewAnalysis(resumeId: string) {
    this.router.navigate(['/analysis', resumeId]);
  }

  deleteResume(resumeId: string, event: Event) {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this resume?')) {
      this.resumeService.deleteResume(resumeId).subscribe({
        next: () => {
          this.loadResumes();
        },
        error: (err) => {
          console.error('Error deleting resume:', err);
        }
      });
    }
  }

  getScoreColor(score: number): string {
    if (score >= 80) return '#4ade80';
    if (score >= 60) return '#fbbf24';
    return '#f87171';
  }

  getScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  }

  getAverageScore(): number {
    if (this.resumes.length === 0) return 0;
    const sum = this.resumes.reduce((acc, r) => acc + r.analysis.atsScore, 0);
    return Math.round(sum / this.resumes.length);
  }

  getTotalSkills(): number {
    const allSkills = new Set();
    this.resumes.forEach(r => {
      r.analysis.skills.forEach(s => allSkills.add(s.name));
    });
    return allSkills.size;
  }
}
