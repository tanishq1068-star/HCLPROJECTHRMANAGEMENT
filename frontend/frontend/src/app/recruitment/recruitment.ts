import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobOpening, JobService } from '../services/job.service';

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './recruitment.html',
  styleUrl: './recruitment.css',
})
export class RecruitmentComponent {
  searchText = '';
  statusFilter = 'All Status';

  jobs: JobOpening[] = [];

  constructor(
    private jobService: JobService,
    private router: Router,
  ) {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobs = this.jobService.getJobs();
  }

  get filteredJobs(): JobOpening[] {
    const search = this.searchText.toLowerCase().trim();

    return this.jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.id.toLowerCase().includes(search) ||
        job.title.toLowerCase().includes(search) ||
        job.department.toLowerCase().includes(search);

      const matchesStatus = this.statusFilter === 'All Status' || job.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  get openPositions(): number {
    return this.jobs.filter((job) => job.status === 'Open').length;
  }

  get totalApplicants(): number {
    return this.jobs.reduce((total, job) => total + job.applicants, 0);
  }

  get interviews(): number {
    return this.jobs.reduce((total, job) => total + Math.floor(job.applicants * 0.18), 0);
  }

  get hired(): number {
    return this.jobs.reduce((total, job) => total + Math.floor(job.applicants * 0.04), 0);
  }

  editJob(job: JobOpening): void {
    this.router.navigate(['/add-job-opening'], {
      queryParams: {
        edit: job.id,
      },
    });
  }

  deleteJob(job: JobOpening): void {
    const confirmed = confirm(`Are you sure you want to delete "${job.title}"?`);

    if (!confirmed) {
      return;
    }

    this.jobService.deleteJob(job.id);

    this.loadJobs();
  }
}
