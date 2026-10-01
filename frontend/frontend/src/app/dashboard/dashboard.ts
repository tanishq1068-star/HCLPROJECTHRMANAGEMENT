import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { Employee, EmployeeService } from '../services/employee.service';

import { JobService } from '../services/job.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  // =====================================================
  // EMPLOYEES
  // =====================================================

  employees: Employee[] = [];

  // =====================================================
  // JOBS
  // =====================================================

  jobs: any[] = [];

  // =====================================================
  // PERFORMANCE
  // =====================================================

  performanceRecords: any[] = [];

  // =====================================================
  // LEAVE REQUESTS
  // =====================================================

  leaveRequests: any[] = [];

  // =====================================================
  // LOADING
  // =====================================================

  loadingEmployees = true;
  loadingJobs = true;

  // =====================================================
  // ATTENDANCE
  // =====================================================

  todayAttendanceDate = '';

  presentToday = 0;
  lateToday = 0;
  absentToday = 0;

  attendancePercentage = 0;

  // =====================================================
  // LEAVE
  // =====================================================

  pendingLeaves = 0;
  approvedLeaves = 0;

  // =====================================================
  // PAYROLL
  // =====================================================

  totalPayroll = 0;
  pendingPayroll = 0;

  // =====================================================
  // PERFORMANCE SUMMARY
  // =====================================================

  averagePerformance = 0;
  completedReviews = 0;

  // =====================================================
  // RECRUITMENT
  // =====================================================

  totalApplicants = 0;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private employeeService: EmployeeService,
    private jobService: JobService,
    private router: Router,
  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {
    this.setTodayDate();

    this.loadEmployees();

    this.loadJobs();

    this.calculateDashboardData();
  }

  // =====================================================
  // TODAY'S DATE
  // =====================================================

  setTodayDate(): void {
    this.todayAttendanceDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  loadEmployees(): void {
    this.loadingEmployees = true;

    this.employeeService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees || [];

        this.calculateDashboardData();

        this.loadingEmployees = false;
      },

      error: (error: any) => {
        console.error('Error loading employees:', error);

        this.employees = [];

        this.calculateDashboardData();

        this.loadingEmployees = false;
      },
    });
  }

  // =====================================================
  // LOAD JOBS
  // =====================================================

  loadJobs(): void {
    this.loadingJobs = true;

    try {
      const result = this.jobService.getJobs();

      this.jobs = result || [];
    } catch (error) {
      console.error('Error loading jobs:', error);

      this.jobs = [];
    }

    this.calculateDashboardData();

    this.loadingJobs = false;
  }

  // =====================================================
  // CALCULATE DASHBOARD DATA
  // =====================================================

  calculateDashboardData(): void {
    // ---------------------------------------------------
    // RECRUITMENT
    // ---------------------------------------------------

    this.totalApplicants = this.jobs.reduce((total: number, job: any) => {
      const applicants = Number(job?.applicants || 0);

      return total + applicants;
    }, 0);

    // ---------------------------------------------------
    // PERFORMANCE
    // ---------------------------------------------------

    this.completedReviews = this.performanceRecords.length;

    if (this.performanceRecords.length > 0) {
      const ratings = this.performanceRecords
        .map((record: any) => Number(record?.rating || 0))
        .filter((rating: number) => rating > 0);

      if (ratings.length > 0) {
        const totalRating = ratings.reduce((sum: number, rating: number) => sum + rating, 0);

        this.averagePerformance = Number((totalRating / ratings.length).toFixed(1));
      } else {
        this.averagePerformance = 0;
      }
    } else {
      this.averagePerformance = 0;
    }

    // ---------------------------------------------------
    // ATTENDANCE
    // ---------------------------------------------------

    /*
     * Attendance service will be connected here later.
     * Keeping safe default values prevents dashboard
     * compilation/runtime errors.
     */

    this.presentToday = 0;
    this.lateToday = 0;
    this.absentToday = 0;

    if (this.employees.length > 0) {
      const totalAttendance = this.presentToday + this.lateToday + this.absentToday;

      if (totalAttendance > 0) {
        this.attendancePercentage = Math.round((this.presentToday / totalAttendance) * 100);
      } else {
        this.attendancePercentage = 0;
      }
    } else {
      this.attendancePercentage = 0;
    }

    // ---------------------------------------------------
    // LEAVE
    // ---------------------------------------------------

    this.pendingLeaves = this.leaveRequests.filter(
      (leave: any) => leave?.status === 'Pending',
    ).length;

    this.approvedLeaves = this.leaveRequests.filter(
      (leave: any) => leave?.status === 'Approved',
    ).length;

    // ---------------------------------------------------
    // PAYROLL
    // ---------------------------------------------------

    /*
     * Payroll service will be connected later.
     */

    this.totalPayroll = 0;
    this.pendingPayroll = 0;
  }

  // =====================================================
  // TOTAL EMPLOYEES
  // =====================================================

  get totalEmployees(): number {
    return this.employees.length;
  }

  // =====================================================
  // ACTIVE EMPLOYEES
  // =====================================================

  get activeEmployees(): number {
    return this.employees.filter((employee: Employee) => employee.status === 'Active').length;
  }

  // =====================================================
  // INACTIVE EMPLOYEES
  // =====================================================

  get inactiveEmployees(): number {
    return this.employees.filter((employee: Employee) => employee.status === 'Inactive').length;
  }

  // =====================================================
  // OPEN JOBS
  // =====================================================

  get openJobs(): number {
    return this.jobs.filter((job: any) => job?.status === 'Open').length;
  }

  // =====================================================
  // TOTAL JOBS
  // =====================================================

  get totalJobs(): number {
    return this.jobs.length;
  }

  // =====================================================
  // RECENT EMPLOYEES
  // =====================================================

  get recentEmployees(): Employee[] {
    return this.employees.slice(0, 5);
  }

  // =====================================================
  // RECENT JOBS
  // =====================================================

  get recentJobs(): any[] {
    return this.jobs.slice(0, 5);
  }

  // =====================================================
  // RECENT LEAVE REQUESTS
  // =====================================================

  get recentLeaveRequests(): any[] {
    return this.leaveRequests.slice(0, 5);
  }

  // =====================================================
  // CURRENCY FORMAT
  // =====================================================

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  }

  // =====================================================
  // REFRESH DASHBOARD
  // =====================================================

  refresh(): void {
    this.loadEmployees();

    this.loadJobs();

    this.calculateDashboardData();
  }

  // =====================================================
  // VIEW EMPLOYEE
  // =====================================================

  viewEmployee(employee: Employee): void {
    this.router.navigate(['/employee-details', employee.id]);
  }

  // =====================================================
  // VIEW ALL EMPLOYEES
  // =====================================================

  viewAllEmployees(): void {
    this.router.navigate(['/employees']);
  }

  // =====================================================
  // VIEW ALL JOBS
  // =====================================================

  viewAllJobs(): void {
    this.router.navigate(['/job-details']);
  }
}
