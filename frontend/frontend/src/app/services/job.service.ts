import { Injectable } from '@angular/core';

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  employmentType: string;
  experience: string;
  location: string;
  salary: string;
  vacancies: number;
  deadline: string;
  description: string;
  skills: string[];
  applicants: number;
  postedDate: string;
  status: 'Open' | 'Closed';
}

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly storageKey = 'hrgenius_jobs';

  private jobs: JobOpening[] = [
    {
      id: 'JOB001',
      title: 'Software Developer',
      department: 'IT',
      employmentType: 'Full Time',
      experience: '1-3 Years',
      location: 'Ghaziabad',
      salary: '₹5-8 LPA',
      vacancies: 5,
      deadline: '2026-10-30',
      description: 'We are looking for a skilled software developer to join our technology team.',
      skills: ['Angular', 'TypeScript', 'JavaScript', 'REST API'],
      applicants: 45,
      postedDate: '2026-09-01',
      status: 'Open',
    },
    {
      id: 'JOB002',
      title: 'UI/UX Designer',
      department: 'Design',
      employmentType: 'Full Time',
      experience: '2-4 Years',
      location: 'Noida',
      salary: '₹4-7 LPA',
      vacancies: 2,
      deadline: '2026-10-25',
      description:
        'Looking for a creative UI/UX designer to design intuitive and engaging digital experiences.',
      skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
      applicants: 28,
      postedDate: '2026-09-03',
      status: 'Open',
    },
    {
      id: 'JOB003',
      title: 'Data Analyst',
      department: 'Data Science',
      employmentType: 'Full Time',
      experience: '1-3 Years',
      location: 'Gurugram',
      salary: '₹5-9 LPA',
      vacancies: 3,
      deadline: '2026-10-20',
      description: 'Join our analytics team to transform business data into meaningful insights.',
      skills: ['SQL', 'Excel', 'Power BI', 'Python'],
      applicants: 36,
      postedDate: '2026-09-05',
      status: 'Open',
    },
    {
      id: 'JOB004',
      title: 'HR Executive',
      department: 'Human Resources',
      employmentType: 'Full Time',
      experience: '1-2 Years',
      location: 'Delhi',
      salary: '₹3-5 LPA',
      vacancies: 1,
      deadline: '2026-09-30',
      description:
        'We are looking for an HR Executive to support recruitment and employee operations.',
      skills: ['Recruitment', 'Employee Relations', 'HR Operations'],
      applicants: 15,
      postedDate: '2026-08-20',
      status: 'Closed',
    },
  ];

  constructor() {
    this.loadJobs();
  }

  getJobs(): JobOpening[] {
    return this.jobs;
  }

  getJobById(id: string): JobOpening | undefined {
    return this.jobs.find((job) => job.id === id);
  }

  addJob(job: JobOpening): void {
    this.jobs.push(job);

    this.saveJobs();
  }

  updateJob(updatedJob: JobOpening): void {
    const index = this.jobs.findIndex((job) => job.id === updatedJob.id);

    if (index === -1) {
      return;
    }

    this.jobs[index] = updatedJob;

    this.saveJobs();
  }

  deleteJob(id: string): void {
    this.jobs = this.jobs.filter((job) => job.id !== id);

    this.saveJobs();
  }

  generateJobId(): string {
    const numbers = this.jobs.map((job) => {
      const match = job.id.match(/^JOB(\d+)$/);

      return match ? Number(match[1]) : 0;
    });

    const nextNumber = Math.max(0, ...numbers) + 1;

    return `JOB${String(nextNumber).padStart(3, '0')}`;
  }

  private saveJobs(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.jobs));
  }

  private loadJobs(): void {
    const savedJobs = localStorage.getItem(this.storageKey);

    if (!savedJobs) {
      this.saveJobs();

      return;
    }

    try {
      const parsedJobs = JSON.parse(savedJobs);

      if (!Array.isArray(parsedJobs)) {
        this.jobs = [...this.jobs];

        this.saveJobs();

        return;
      }

      this.jobs = parsedJobs.map((job: any) => this.normalizeJob(job));

      this.saveJobs();
    } catch {
      this.jobs = [...this.jobs];

      this.saveJobs();
    }
  }

  private normalizeJob(job: any): JobOpening {
    let skills: string[] = [];

    if (Array.isArray(job.skills)) {
      skills = job.skills
        .map((skill: any) => String(skill).trim())
        .filter((skill: string) => skill.length > 0);
    } else if (typeof job.skills === 'string') {
      skills = job.skills
        .split(',')
        .map((skill: string) => skill.trim())
        .filter((skill: string) => skill.length > 0);
    }

    return {
      id: String(job.id || ''),

      title: String(job.title || ''),

      department: String(job.department || ''),

      employmentType: String(job.employmentType || 'Full Time'),

      experience: String(job.experience || ''),

      location: String(job.location || ''),

      salary: String(job.salary || ''),

      vacancies: Number(job.vacancies || 0),

      deadline: String(job.deadline || ''),

      description: String(job.description || ''),

      skills,

      applicants: Number(job.applicants || 0),

      postedDate: String(job.postedDate || ''),

      status: job.status === 'Closed' ? 'Closed' : 'Open',
    };
  }
}
