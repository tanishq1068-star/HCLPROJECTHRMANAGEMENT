import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { JobOpening, JobService } from '../services/job.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-details.html',
  styleUrl: './job-details.css',
})
export class JobDetailsComponent {
  jobId = '';

  job: JobOpening | undefined;

  skills: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
  ) {
    this.loadJob();
  }

  loadJob(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      alert('Job opening not found.');

      this.router.navigate(['/recruitment']);

      return;
    }

    this.jobId = id;

    this.job = this.jobService.getJobById(id);

    if (!this.job) {
      alert('Job opening not found.');

      this.router.navigate(['/recruitment']);

      return;
    }

    this.skills = Array.isArray(this.job.skills)
      ? this.job.skills
          .map((skill: string) => skill.trim())
          .filter((skill: string) => skill.length > 0)
      : [];
  }

  get skillsList(): string[] {
    return this.skills;
  }

  get isOpen(): boolean {
    return this.job?.status === 'Open';
  }

  formatDate(date: string): string {
    if (!date) {
      return '';
    }

    const dateObject = new Date(`${date}T00:00:00`);

    return dateObject.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  formatDeadline(date: string): string {
    if (!date) {
      return '';
    }

    const deadline = new Date(`${date}T00:00:00`);

    return deadline.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  editJob(): void {
    if (!this.job) {
      return;
    }

    this.router.navigate(['/add-job-opening'], {
      queryParams: {
        edit: this.job.id,
      },
    });
  }

  deleteJob(): void {
    if (!this.job) {
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete "${this.job.title}"?`);

    if (!confirmed) {
      return;
    }

    this.jobService.deleteJob(this.job.id);

    alert('Job opening deleted successfully.');

    this.router.navigate(['/recruitment']);
  }

  goBack(): void {
    this.router.navigate(['/recruitment']);
  }
}
