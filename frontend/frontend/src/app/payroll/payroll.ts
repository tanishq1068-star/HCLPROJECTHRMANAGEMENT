import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PayrollRecord, PayrollService } from '../services/payroll.service';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './payroll.html',
  styleUrl: './payroll.css',
})
export class PayrollComponent {
  searchText = '';
  monthFilter = 'All Months';
  statusFilter = 'All Status';

  payroll: PayrollRecord[] = [];

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
    private payrollService: PayrollService,
    private router: Router,
  ) {
    this.loadPayroll();
  }

  loadPayroll(): void {
    this.payroll = this.payrollService.getPayroll();
  }

  get filteredPayroll(): PayrollRecord[] {
    const search = this.searchText.toLowerCase().trim();

    return this.payroll.filter((record) => {
      const matchesSearch =
        !search ||
        record.id.toLowerCase().includes(search) ||
        record.employeeId.toLowerCase().includes(search) ||
        record.employeeName.toLowerCase().includes(search) ||
        record.department.toLowerCase().includes(search);

      const matchesMonth = this.monthFilter === 'All Months' || record.month === this.monthFilter;

      const matchesStatus =
        this.statusFilter === 'All Status' || record.status === this.statusFilter;

      return matchesSearch && matchesMonth && matchesStatus;
    });
  }

  get totalGrossSalary(): number {
    return this.payroll.reduce((total, record) => total + record.grossSalary, 0);
  }

  get totalNetSalary(): number {
    return this.payroll.reduce((total, record) => total + record.netSalary, 0);
  }

  get processedCount(): number {
    return this.payroll.filter((record) => record.status === 'Processed').length;
  }

  get pendingCount(): number {
    return this.payroll.filter((record) => record.status === 'Pending').length;
  }

  processPayroll(id: string): void {
    const payroll = this.payrollService.getPayrollById(id);

    if (!payroll) {
      alert('Payroll record not found.');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to process payroll for ${payroll.employeeName}?`,
    );

    if (!confirmed) {
      return;
    }

    this.payrollService.processPayroll(id);

    this.loadPayroll();

    alert('Payroll processed successfully!');
  }

  processAllPending(): void {
    const pendingPayroll = this.payroll.filter((record) => record.status === 'Pending');

    if (pendingPayroll.length === 0) {
      alert('There are no pending payroll records.');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to process ${pendingPayroll.length} pending payroll record(s)?`,
    );

    if (!confirmed) {
      return;
    }

    pendingPayroll.forEach((record) => {
      this.payrollService.processPayroll(record.id);
    });

    this.loadPayroll();

    alert('All pending payroll records have been processed successfully!');
  }

  deletePayroll(id: string): void {
    const payroll = this.payrollService.getPayrollById(id);

    if (!payroll) {
      alert('Payroll record not found.');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete payroll ${payroll.id} for ${payroll.employeeName}?`,
    );

    if (!confirmed) {
      return;
    }

    this.payrollService.deletePayroll(id);

    this.loadPayroll();

    alert('Payroll record deleted successfully.');
  }

  openPayroll(id: string): void {
    this.router.navigate(['/payroll-details', id]);
  }
}
