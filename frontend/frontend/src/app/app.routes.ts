import { Routes } from '@angular/router';

import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';

import { EmployeesComponent } from './employees/employees';
import { AddEmployeeComponent } from './add-employee/add-employee';
import { EmployeeDetailsComponent } from './employee-details/employee-details';

import { RecruitmentComponent } from './recruitment/recruitment';
import { AddJobOpeningComponent } from './add-job-opening/add-job-opening';
import { JobDetailsComponent } from './job-details/job-details';

import { AttendanceComponent } from './attendance/attendance';
import { MarkAttendanceComponent } from './mark-attendance/mark-attendance';

import { LeaveManagementComponent } from './leave-management/leave-management';
import { ApplyLeaveComponent } from './apply-leave/apply-leave';
import { LeaveDetailsComponent } from './leave-details/leave-details';

import { PayrollComponent } from './payroll/payroll';
import { ProcessPayrollComponent } from './process-payroll/process-payroll';
import { PayrollDetailsComponent } from './payroll-details/payroll-details';

import { PerformanceComponent } from './performance/performance';
import { AddPerformanceReviewComponent } from './add-performance-review/add-performance-review';
import { PerformanceDetailsComponent } from './performance-details/performance-details';

import { ReportsComponent } from './reports/reports';
import { GenerateReportComponent } from './generate-report/generate-report';

import { SettingsComponent } from './settings/settings';
import { ChangePasswordComponent } from './change-password/change-password';
import { SecurityComponent } from './security/security';

export const routes: Routes = [
  // =====================================================
  // LOGIN
  // =====================================================

  {
    path: 'login',
    component: LoginComponent,
  },

  // =====================================================
  // DASHBOARD
  // =====================================================

  {
    path: 'dashboard',
    component: DashboardComponent,
  },

  // =====================================================
  // EMPLOYEES
  // =====================================================

  {
    path: 'employees',
    component: EmployeesComponent,
  },
  {
    path: 'add-employee',
    component: AddEmployeeComponent,
  },
  {
    path: 'employee-details/:id',
    component: EmployeeDetailsComponent,
  },

  // =====================================================
  // RECRUITMENT
  // =====================================================

  {
    path: 'recruitment',
    component: RecruitmentComponent,
  },
  {
    path: 'add-job-opening',
    component: AddJobOpeningComponent,
  },
  {
    path: 'job-details/:id',
    component: JobDetailsComponent,
  },

  // =====================================================
  // ATTENDANCE
  // =====================================================

  {
    path: 'attendance',
    component: AttendanceComponent,
  },
  {
    path: 'mark-attendance',
    component: MarkAttendanceComponent,
  },

  // =====================================================
  // LEAVE MANAGEMENT
  // =====================================================

  {
    path: 'leave-management',
    component: LeaveManagementComponent,
  },
  {
    path: 'apply-leave',
    component: ApplyLeaveComponent,
  },
  {
    path: 'leave-details/:id',
    component: LeaveDetailsComponent,
  },

  // =====================================================
  // PAYROLL
  // =====================================================

  {
    path: 'payroll',
    component: PayrollComponent,
  },
  {
    path: 'add-payroll',
    component: ProcessPayrollComponent,
  },
  {
    path: 'process-payroll',
    component: ProcessPayrollComponent,
  },
  {
    path: 'payroll-details/:id',
    component: PayrollDetailsComponent,
  },

  // =====================================================
  // PERFORMANCE
  // =====================================================

  {
    path: 'performance',
    component: PerformanceComponent,
  },
  {
    path: 'add-performance-review',
    component: AddPerformanceReviewComponent,
  },
  {
    path: 'performance-details/:id',
    component: PerformanceDetailsComponent,
  },

  // =====================================================
  // REPORTS
  // =====================================================

  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'generate-report',
    component: GenerateReportComponent,
  },

  // =====================================================
  // SETTINGS
  // =====================================================

  {
    path: 'settings',
    component: SettingsComponent,
  },

  // Security
  {
    path: 'security',
    component: SecurityComponent,
  },

  // Change Password
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },

  // =====================================================
  // DEFAULT
  // =====================================================

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  // =====================================================
  // INVALID URL
  // =====================================================

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
