import { Injectable } from '@angular/core';

export interface DepartmentReport {
  department: string;
  employees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  averageSalary: number;
  totalPayroll: number;
}

export interface AttendanceReport {
  status: string;
  count: number;
  percentage: number;
}

export interface LeaveReport {
  leaveType: string;
  totalRequests: number;
  approved: number;
  pending: number;
  rejected: number;
  totalDays: number;
}

export interface PayrollReport {
  employeeName: string;
  employeeId: string;
  department: string;
  basicSalary: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  getDepartmentReport(employees: any[], payroll: any[]): DepartmentReport[] {
    const departments = [...new Set(employees.map((employee) => employee.department))];

    return departments.map((department) => {
      const departmentEmployees = employees.filter(
        (employee) => employee.department === department,
      );

      const departmentPayroll = payroll.filter((record) => record.department === department);

      const totalPayroll = departmentPayroll.reduce((total, record) => total + record.netSalary, 0);

      const averageSalary =
        departmentPayroll.length > 0 ? Math.round(totalPayroll / departmentPayroll.length) : 0;

      return {
        department,
        employees: departmentEmployees.length,

        activeEmployees: departmentEmployees.filter((employee) => employee.status === 'Active')
          .length,

        inactiveEmployees: departmentEmployees.filter((employee) => employee.status === 'Inactive')
          .length,

        averageSalary,
        totalPayroll,
      };
    });
  }

  getAttendanceReport(attendance: any[]): AttendanceReport[] {
    const statuses = ['Present', 'Late', 'Half Day', 'Absent', 'On Leave'];

    const total = attendance.length;

    return statuses.map((status) => {
      const count = attendance.filter((record) => record.status === status).length;

      return {
        status,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });
  }

  getLeaveReport(leaves: any[]): LeaveReport[] {
    const leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Unpaid Leave'];

    return leaveTypes.map((leaveType) => {
      const typeLeaves = leaves.filter((leave) => leave.leaveType === leaveType);

      return {
        leaveType,

        totalRequests: typeLeaves.length,

        approved: typeLeaves.filter((leave) => leave.status === 'Approved').length,

        pending: typeLeaves.filter((leave) => leave.status === 'Pending').length,

        rejected: typeLeaves.filter((leave) => leave.status === 'Rejected').length,

        totalDays: typeLeaves.reduce((total, leave) => total + leave.days, 0),
      };
    });
  }

  getPayrollReport(payroll: any[]): PayrollReport[] {
    return payroll.map((record) => ({
      employeeName: record.employeeName,

      employeeId: record.employeeId,

      department: record.department,

      basicSalary: record.basicSalary,

      grossSalary: record.grossSalary,

      deductions: record.deductions,

      netSalary: record.netSalary,
    }));
  }

  getTotalEmployees(employees: any[]): number {
    return employees.length;
  }

  getActiveEmployees(employees: any[]): number {
    return employees.filter((employee) => employee.status === 'Active').length;
  }

  getTotalPayroll(payroll: any[]): number {
    return payroll.reduce((total, record) => total + record.netSalary, 0);
  }

  getAveragePayroll(payroll: any[]): number {
    if (payroll.length === 0) {
      return 0;
    }

    return Math.round(this.getTotalPayroll(payroll) / payroll.length);
  }
}
