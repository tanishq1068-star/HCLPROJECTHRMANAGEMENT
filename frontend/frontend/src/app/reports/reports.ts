
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Employee,
  EmployeeService
} from '../services/employee.service';

import {
  PayrollRecord,
  PayrollService
} from '../services/payroll.service';

import {
  AttendanceRecord,
  AttendanceService
} from '../services/attendance.service';

import {
  LeaveRecord,
  LeaveService
} from '../services/leave.service';

import {
  DepartmentReport,
  AttendanceReport,
  LeaveReport,
  PayrollReport,
  ReportService
} from '../services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {

  selectedReport = 'Overview';

  employees: Employee[] = [];

  payroll: PayrollRecord[] = [];

  attendance: AttendanceRecord[] = [];

  leaves: LeaveRecord[] = [];

  departmentReport: DepartmentReport[] = [];

  attendanceReport: AttendanceReport[] = [];

  leaveReport: LeaveReport[] = [];

  payrollReport: PayrollReport[] = [];

  reportOptions = [
    'Overview',
    'Employees',
    'Payroll',
    'Attendance',
    'Leave'
  ];

  loading = false;

  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private payrollService: PayrollService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {

    this.loading = true;

    this.errorMessage = '';

    /*
     * EMPLOYEES
     *
     * EmployeeService is now connected to backend,
     * therefore getEmployees() returns Observable<Employee[]>.
     */
    this.employeeService.getEmployees().subscribe({

      next: (employees: Employee[]) => {

        this.employees = employees;

        /*
         * These services are currently returning
         * normal arrays, so DO NOT use subscribe()
         * on them.
         */

        this.payroll =
          this.payrollService.getPayroll();

        this.attendance =
          this.attendanceService.getAttendance();

        this.leaves =
          this.leaveService.getLeaves();

        /*
         * Generate reports after all data is loaded.
         */

        this.departmentReport =
          this.reportService.getDepartmentReport(
            this.employees,
            this.payroll
          );

        this.attendanceReport =
          this.reportService.getAttendanceReport(
            this.attendance
          );

        this.leaveReport =
          this.reportService.getLeaveReport(
            this.leaves
          );

        this.payrollReport =
          this.reportService.getPayrollReport(
            this.payroll
          );

        this.loading = false;
      },

      error: (error: any) => {

        console.error(
          'Failed to load employees:',
          error
        );

        this.loading = false;

        this.errorMessage =
          'Unable to connect to the backend. Please make sure the Spring Boot server is running.';
      }

    });
  }

  get totalEmployees(): number {

    return this.reportService.getTotalEmployees(
      this.employees
    );
  }

  get activeEmployees(): number {

    return this.reportService.getActiveEmployees(
      this.employees
    );
  }

  get inactiveEmployees(): number {

    return (
      this.totalEmployees -
      this.activeEmployees
    );
  }

  get totalPayroll(): number {

    return this.reportService.getTotalPayroll(
      this.payroll
    );
  }

  get averagePayroll(): number {

    return this.reportService.getAveragePayroll(
      this.payroll
    );
  }

  get presentCount(): number {

    return this.attendance.filter(
      (record: AttendanceRecord) =>
        record.status === 'Present'
    ).length;
  }

  get lateCount(): number {

    return this.attendance.filter(
      (record: AttendanceRecord) =>
        record.status === 'Late'
    ).length;
  }

  get absentCount(): number {

    return this.attendance.filter(
      (record: AttendanceRecord) =>
        record.status === 'Absent'
    ).length;
  }

  get leaveCount(): number {

    return this.attendance.filter(
      (record: AttendanceRecord) =>
        record.status === 'On Leave'
    ).length;
  }

  get attendancePercentage(): number {

    if (this.attendance.length === 0) {
      return 0;
    }

    const presentLike =
      this.presentCount +
      this.lateCount;

    return Math.round(
      (presentLike / this.attendance.length) * 100
    );
  }

  get totalLeaveRequests(): number {

    return this.leaves.length;
  }

  get approvedLeaves(): number {

    return this.leaves.filter(
      (leave: LeaveRecord) =>
        leave.status === 'Approved'
    ).length;
  }

  get pendingLeaves(): number {

    return this.leaves.filter(
      (leave: LeaveRecord) =>
        leave.status === 'Pending'
    ).length;
  }

  get rejectedLeaves(): number {

    return this.leaves.filter(
      (leave: LeaveRecord) =>
        leave.status === 'Rejected'
    ).length;
  }

  get totalLeaveDays(): number {

    return this.leaves.reduce(
      (
        total: number,
        leave: LeaveRecord
      ) => total + Number(leave.days || 0),
      0
    );
  }

  onReportChange(): void {

    this.loadReports();
  }

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'Active':
      case 'Present':
      case 'Approved':
      case 'Completed':
        return 'status-active';

      case 'Pending':
      case 'Late':
      case 'In Progress':
        return 'status-pending';

      case 'Inactive':
      case 'Absent':
      case 'Rejected':
        return 'status-inactive';

      case 'Half Day':
      case 'On Leave':
        return 'status-warning';

      default:
        return '';
    }
  }

  getAttendancePercentage(
    report: AttendanceReport
  ): number {

    return report.percentage;
  }

  getLeaveApprovalPercentage(
    report: LeaveReport
  ): number {

    if (report.totalRequests === 0) {
      return 0;
    }

    return Math.round(
      (
        report.approved /
        report.totalRequests
      ) * 100
    );
  }

  formatCurrency(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-IN',
      {
        maximumFractionDigits: 0
      }
    ).format(amount);
  }

  exportReport(): void {

    let content = '';

    /*
     * EMPLOYEE REPORT
     */

    if (
      this.selectedReport === 'Employees'
    ) {

      content =
        'Employee Report\n\n' +
        'Employee ID,Name,Email,Phone,Department,Position,Joining Date,Status\n';

      this.employees.forEach(
        (employee: Employee) => {

          content +=
            `${this.csv(employee.id)},` +
            `${this.csv(employee.name)},` +
            `${this.csv(employee.email)},` +
            `${this.csv(employee.phone)},` +
            `${this.csv(employee.department)},` +
            `${this.csv(employee.position)},` +
            `${this.csv(employee.joiningDate)},` +
            `${this.csv(employee.status)}\n`;
        }
      );
    }

    /*
     * PAYROLL REPORT
     */

    else if (
      this.selectedReport === 'Payroll'
    ) {

      content =
        'Payroll Report\n\n' +
        'Payroll ID,Employee ID,Employee,Department,Month,Basic Salary,Gross Salary,Deductions,Net Salary,Status\n';

      this.payroll.forEach(
        (record: PayrollRecord) => {

          content +=
            `${this.csv(record.id)},` +
            `${this.csv(record.employeeId)},` +
            `${this.csv(record.employeeName)},` +
            `${this.csv(record.department)},` +
            `${this.csv(record.month)},` +
            `${record.basicSalary},` +
            `${record.grossSalary},` +
            `${record.deductions},` +
            `${record.netSalary},` +
            `${this.csv(record.status)}\n`;
        }
      );
    }

    /*
     * ATTENDANCE REPORT
     */

    else if (
      this.selectedReport === 'Attendance'
    ) {

      content =
        'Attendance Report\n\n' +
        'Employee ID,Employee,Department,Date,Check In,Check Out,Status,Remarks\n';

      this.attendance.forEach(
        (record: AttendanceRecord) => {

          content +=
            `${this.csv(record.employeeId)},` +
            `${this.csv(record.employeeName)},` +
            `${this.csv(record.department)},` +
            `${this.csv(record.date)},` +
            `${this.csv(record.checkIn)},` +
            `${this.csv(record.checkOut)},` +
            `${this.csv(record.status)},` +
            `${this.csv(record.remarks)}\n`;
        }
      );
    }

    /*
     * LEAVE REPORT
     */

    else if (
      this.selectedReport === 'Leave'
    ) {

      content =
        'Leave Report\n\n' +
        'Leave ID,Employee ID,Employee,Department,Leave Type,Start Date,End Date,Days,Status,Reason\n';

      this.leaves.forEach(
        (leave: LeaveRecord) => {

          content +=
            `${this.csv(leave.id)},` +
            `${this.csv(leave.employeeId)},` +
            `${this.csv(leave.employeeName)},` +
            `${this.csv(leave.department)},` +
            `${this.csv(leave.leaveType)},` +
            `${this.csv(leave.startDate)},` +
            `${this.csv(leave.endDate)},` +
            `${leave.days},` +
            `${this.csv(leave.status)},` +
            `${this.csv(leave.reason)}\n`;
        }
      );
    }

    /*
     * OVERVIEW REPORT
     */

    else {

      content =
        'HRGenius Overview Report\n\n' +

        `Total Employees,${this.totalEmployees}\n` +

        `Active Employees,${this.activeEmployees}\n` +

        `Inactive Employees,${this.inactiveEmployees}\n` +

        `Total Payroll,${this.totalPayroll}\n` +

        `Average Payroll,${this.averagePayroll}\n` +

        `Attendance Percentage,${this.attendancePercentage}%\n` +

        `Total Leave Requests,${this.totalLeaveRequests}\n` +

        `Approved Leaves,${this.approvedLeaves}\n` +

        `Pending Leaves,${this.pendingLeaves}\n` +

        `Rejected Leaves,${this.rejectedLeaves}\n` +

        `Total Leave Days,${this.totalLeaveDays}\n`;
    }

    /*
     * CREATE CSV FILE
     */

    const blob = new Blob(
      [content],
      {
        type: 'text/csv;charset=utf-8;'
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      `HRGenius-${this.selectedReport}-Report.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /*
   * CSV ESCAPE HELPER
   */

  private csv(
    value: unknown
  ): string {

    const text =
      String(value ?? '');

    return `"${text.replace(
      /"/g,
      '""'
    )}"`;
  }
}
