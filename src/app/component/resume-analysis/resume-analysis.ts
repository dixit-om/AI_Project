import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ResumeService, ResumeAnalysis, Skill } from '../../services/resume.service';

@Component({
  selector: 'app-resume-analysis',
  imports: [CommonModule, RouterLink],
  templateUrl: './resume-analysis.html',
  styleUrl: './resume-analysis.css',
})
export class ResumeAnalysisComponent implements OnInit {
  resumeId: string = '';
  analysis: ResumeAnalysis | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resumeService: ResumeService
  ) {}

  ngOnInit() {
    this.resumeId = this.route.snapshot.paramMap.get('id') || '';
    if (this.resumeId) {
      this.loadAnalysis();
    } else {
      this.error = 'Invalid resume ID';
      this.loading = false;
    }
  }

  loadAnalysis() {
    this.resumeService.getResume(this.resumeId).subscribe({
      next: (response) => {
        this.analysis = response.resume.analysis;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load analysis';
        this.loading = false;
        console.error(err);
      }
    });
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

  getSkillsByCategory(category: string): Skill[] {
    return this.analysis?.skills.filter(s => s.category === category) || [];
  }

  getCategoryCount(): number {
    const categories = new Set(this.analysis?.skills.map(s => s.category) || []);
    return categories.size;
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}

