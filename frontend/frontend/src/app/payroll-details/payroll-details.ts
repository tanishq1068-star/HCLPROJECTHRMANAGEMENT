import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Employee, EmployeeService } from '../services/employee.service';

import { PayrollRecord, PayrollService } from '../services/payroll.service';

@Component({
  selector: 'app-payroll-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll-details.html',
  styleUrl: './payroll-details.css',
})
export class PayrollDetailsComponent {
  employees: Employee[] = [];

  selectedEmployee: Employee | undefined;

  payrollId = '';

  isEditMode = false;

  selectedEmployeeId = '';

  month = '';

  basicSalary = 0;

  allowances = 0;

  deductions = 0;

  grossSalary = 0;

  netSalary = 0;

  status: PayrollRecord['status'] = 'Pending';

  paymentDate = '';

  months: string[] = [
    'September 2026',
    'August 2026',
    'July 2026',
    'June 2026',
    'May 2026',
    'April 2026',
    'March 2026',
    'February 2026',
    'January 2026',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private payrollService: PayrollService,
    private employeeService: EmployeeService,
  ) {
    /*
     * EmployeeService now returns Observable<Employee[]>.
     */
    this.employeeService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees || [];

        /*
         * Load payroll only after employees
         * have been loaded.
         */
        this.loadPayroll();
      },

      error: (error) => {
        console.error('Error loading employees:', error);

        this.employees = [];

        alert('Unable to load employees.');
      },
    });
  }

  /**
   * Find selected employee from the employees
   * already loaded from the backend.
   */
  loadSelectedEmployee(): void {
    if (!this.selectedEmployeeId) {
      this.selectedEmployee = undefined;

      return;
    }

    this.selectedEmployee = this.employees.find(
      (employee) => employee.id === this.selectedEmployeeId,
    );
  }

  /**
   * Load payroll for edit mode.
   */
  loadPayroll(): void {
    const id = this.route.snapshot.paramMap.get('id');

    /*
     * New payroll.
     */
    if (!id) {
      this.month = 'September 2026';

      this.paymentDate = '';

      this.selectedEmployee = undefined;

      return;
    }

    /*
     * Edit existing payroll.
     */
    this.payrollId = id;

    this.isEditMode = true;

    const payroll = this.payrollService.getPayrollById(id);

    if (!payroll) {
      alert('Payroll record not found.');

      this.router.navigate(['/payroll']);

      return;
    }

    this.selectedEmployeeId = payroll.employeeId;

    this.month = payroll.month;

    this.basicSalary = payroll.basicSalary;

    this.allowances = payroll.allowances;

    this.deductions = payroll.deductions;

    this.grossSalary = payroll.grossSalary;

    this.netSalary = payroll.netSalary;

    this.status = payroll.status;

    this.paymentDate = payroll.paymentDate;

    /*
     * Employee list has already been loaded,
     * so find the employee locally.
     */
    this.loadSelectedEmployee();

    this.calculateSalary();
  }

  /**
   * Called when employee dropdown changes.
   */
  onEmployeeChange(): void {
    this.loadSelectedEmployee();

    const employee = this.selectedEmployee;

    if (!employee) {
      return;
    }
  }

  /**
   * Calculate gross and net salary.
   */
  calculateSalary(): void {
    this.basicSalary = Number(this.basicSalary) || 0;

    this.allowances = Number(this.allowances) || 0;

    this.deductions = Number(this.deductions) || 0;

    this.grossSalary = this.payrollService.calculateGrossSalary(this.basicSalary, this.allowances);

    this.netSalary = this.payrollService.calculateNetSalary(this.grossSalary, this.deductions);

    if (this.netSalary < 0) {
      this.netSalary = 0;
    }
  }

  /**
   * Save payroll.
   */
  savePayroll(): void {
    if (!this.selectedEmployeeId || !this.month) {
      alert('Please select an employee and payroll month.');

      return;
    }

    if (this.basicSalary <= 0) {
      alert('Basic salary must be greater than zero.');

      return;
    }

    if (this.allowances < 0) {
      alert('Allowances cannot be negative.');

      return;
    }

    if (this.deductions < 0) {
      alert('Deductions cannot be negative.');

      return;
    }

    if (this.deductions > this.grossSalary) {
      alert('Deductions cannot be greater than gross salary.');

      return;
    }

    /*
     * Find employee from the already loaded
     * backend employee list.
     */
    const employee = this.employees.find((item) => item.id === this.selectedEmployeeId);

    if (!employee) {
      alert('Employee not found.');

      return;
    }

    this.selectedEmployee = employee;

    this.calculateSalary();

    /*
     * Processed payroll requires
     * a payment date.
     */
    if (this.status === 'Processed' && !this.paymentDate) {
      this.paymentDate = this.payrollService.getToday();
    }

    /*
     * Pending payroll has no payment date.
     */
    if (this.status === 'Pending') {
      this.paymentDate = '';
    }

    /*
     * Edit existing payroll.
     */
    if (this.isEditMode) {
      this.updatePayroll(employee);

      return;
    }

    /*
     * Check duplicate payroll.
     */
    const duplicate = this.payrollService
      .getPayroll()
      .find((payroll) => payroll.employeeId === employee.id && payroll.month === this.month);

    if (duplicate) {
      alert(`${employee.name} already has payroll for ${this.month}.`);

      return;
    }

    /*
     * Create payroll record.
     */
    const payroll: PayrollRecord = {
      id: this.payrollService.generatePayrollId(),

      employeeId: employee.id,

      employeeName: employee.name,

      department: employee.department,

      month: this.month,

      basicSalary: this.basicSalary,

      allowances: this.allowances,

      deductions: this.deductions,

      grossSalary: this.grossSalary,

      netSalary: this.netSalary,

      status: this.status,

      paymentDate: this.paymentDate,
    };

    this.payrollService.addPayroll(payroll);

    alert('Payroll created successfully!');

    this.router.navigate(['/payroll']);
  }

  /**
   * Update payroll.
   */
  updatePayroll(employee: Employee): void {
    const existingPayroll = this.payrollService.getPayrollById(this.payrollId);

    if (!existingPayroll) {
      alert('Payroll record not found.');

      return;
    }

    /*
     * Check duplicate payroll.
     */
    const duplicate = this.payrollService
      .getPayroll()
      .find(
        (payroll) =>
          payroll.id !== this.payrollId &&
          payroll.employeeId === employee.id &&
          payroll.month === this.month,
      );

    if (duplicate) {
      alert(`${employee.name} already has another payroll record for ${this.month}.`);

      return;
    }

    /*
     * Create updated payroll.
     */
    const updatedPayroll: PayrollRecord = {
      ...existingPayroll,

      employeeId: employee.id,

      employeeName: employee.name,

      department: employee.department,

      month: this.month,

      basicSalary: this.basicSalary,

      allowances: this.allowances,

      deductions: this.deductions,

      grossSalary: this.grossSalary,

      netSalary: this.netSalary,

      status: this.status,

      paymentDate: this.paymentDate,
    };

    this.payrollService.updatePayroll(updatedPayroll);

    alert('Payroll updated successfully!');

    this.router.navigate(['/payroll']);
  }

  /**
   * Cancel and return to payroll page.
   */
  cancel(): void {
    this.router.navigate(['/payroll']);
  }
}
