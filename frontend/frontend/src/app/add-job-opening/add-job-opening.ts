import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { JobOpening, JobService } from '../services/job.service';

@Component({
  selector: 'app-add-job-opening',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-job-opening.html',
  styleUrl: './add-job-opening.css',
})
export class AddJobOpeningComponent {
  isEditMode = false;

  jobId = '';

  /*
   * Compatibility object used by
   * the existing HTML template.
   */
  job = {
    title: '',
    department: '',
    employmentType: 'Full Time',
    experience: '',
    location: '',
    salary: '',
    vacancies: 1,
    deadline: '',
    description: '',
    skills: '',
  };

  /*
   * Component properties kept for
   * compatibility with the existing
   * TypeScript logic.
   */
  title = '';

  department = '';

  employmentType = 'Full Time';

  experience = '';

  location = '';

  salary = '';

  vacancies = 1;

  deadline = '';

  description = '';

  skillsInput = '';

  applicants = 0;

  postedDate = '';

  status: 'Open' | 'Closed' = 'Open';

  employmentTypes = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Temporary'];

  departments = [
    'IT',
    'HR',
    'Finance',
    'Marketing',
    'Design',
    'Data Science',
    'Sales',
    'Operations',
  ];

  constructor(
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loadJobForEdit();
  }

  loadJobForEdit(): void {
    const editId = this.route.snapshot.queryParamMap.get('edit');

    if (!editId) {
      return;
    }

    const existingJob = this.jobService.getJobById(editId);

    if (!existingJob) {
      alert('Job opening not found.');

      this.router.navigate(['/recruitment']);

      return;
    }

    this.isEditMode = true;

    this.jobId = existingJob.id;

    this.title = existingJob.title;

    this.department = existingJob.department;

    this.employmentType = existingJob.employmentType;

    this.experience = existingJob.experience;

    this.location = existingJob.location;

    this.salary = existingJob.salary;

    this.vacancies = existingJob.vacancies;

    this.deadline = existingJob.deadline;

    this.description = existingJob.description;

    const skills = Array.isArray(existingJob.skills) ? existingJob.skills : [];

    this.skillsInput = skills.join(', ');

    this.applicants = existingJob.applicants;

    this.postedDate = existingJob.postedDate;

    this.status = existingJob.status;

    /*
     * Populate the object used by
     * the HTML template.
     */
    this.syncFormObject();
  }

  /*
   * Copy the normal component
   * properties into the object
   * used by the HTML template.
   */
  private syncFormObject(): void {
    this.job = {
      title: this.title,

      department: this.department,

      employmentType: this.employmentType,

      experience: this.experience,

      location: this.location,

      salary: this.salary,

      vacancies: Number(this.vacancies),

      deadline: this.deadline,

      description: this.description,

      skills: this.skillsInput,
    };
  }

  /*
   * Copy values entered through
   * job.* bindings back into the
   * component properties.
   */
  private syncComponentProperties(): void {
    this.title = this.job.title;

    this.department = this.job.department;

    this.employmentType = this.job.employmentType;

    this.experience = this.job.experience;

    this.location = this.job.location;

    this.salary = this.job.salary;

    this.vacancies = Number(this.job.vacancies);

    this.deadline = this.job.deadline;

    this.description = this.job.description;

    this.skillsInput = this.job.skills;
  }

  saveJob(): void {
    /*
     * The HTML template uses
     * job.* bindings, so first
     * synchronize those values.
     */
    this.syncComponentProperties();

    if (
      !this.title.trim() ||
      !this.department ||
      !this.employmentType ||
      !this.experience.trim() ||
      !this.location.trim() ||
      !this.salary.trim() ||
      !this.deadline ||
      !this.description.trim()
    ) {
      alert('Please fill in all required fields.');

      return;
    }

    if (this.vacancies <= 0) {
      alert('Vacancies must be at least 1.');

      return;
    }

    const skills = this.skillsInput
      .split(',')
      .map((skill: string) => skill.trim())
      .filter((skill: string) => skill.length > 0);

    if (skills.length === 0) {
      alert('Please enter at least one skill.');

      return;
    }

    if (this.isEditMode) {
      this.updateJob(skills);

      return;
    }

    const job: JobOpening = {
      id: this.jobService.generateJobId(),

      title: this.title.trim(),

      department: this.department,

      employmentType: this.employmentType,

      experience: this.experience.trim(),

      location: this.location.trim(),

      salary: this.salary.trim(),

      vacancies: Number(this.vacancies),

      deadline: this.deadline,

      description: this.description.trim(),

      skills,

      applicants: 0,

      postedDate: this.getToday(),

      status: this.status,
    };

    this.jobService.addJob(job);

    alert('Job opening created successfully!');

    this.router.navigate(['/recruitment']);
  }

  updateJob(skills: string[]): void {
    const existingJob = this.jobService.getJobById(this.jobId);

    if (!existingJob) {
      alert('Job opening not found.');

      return;
    }

    const updatedJob: JobOpening = {
      ...existingJob,

      title: this.title.trim(),

      department: this.department,

      employmentType: this.employmentType,

      experience: this.experience.trim(),

      location: this.location.trim(),

      salary: this.salary.trim(),

      vacancies: Number(this.vacancies),

      deadline: this.deadline,

      description: this.description.trim(),

      skills,

      status: this.status,
    };

    this.jobService.updateJob(updatedJob);

    alert('Job opening updated successfully!');

    this.router.navigate(['/recruitment']);
  }

  getToday(): string {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  cancel(): void {
    this.router.navigate(['/recruitment']);
  }
}
