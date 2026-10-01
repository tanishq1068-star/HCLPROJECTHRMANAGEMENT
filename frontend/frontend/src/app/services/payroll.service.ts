import { Injectable } from '@angular/core';

export type PayrollStatus = 'Processed' | 'Pending';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  status: PayrollStatus;
  paymentDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private readonly storageKey = 'hrgenius_payroll';

  private payroll: PayrollRecord[] = [];

  constructor() {
    this.loadPayroll();
  }

  getPayroll(): PayrollRecord[] {
    return this.payroll;
  }

  getPayrollById(id: string): PayrollRecord | undefined {
    return this.payroll.find((payroll) => payroll.id === id);
  }

  getEmployeePayroll(employeeId: string): PayrollRecord[] {
    return this.payroll.filter((payroll) => payroll.employeeId === employeeId);
  }

  addPayroll(payroll: PayrollRecord): void {
    this.payroll.push(payroll);

    this.savePayroll();
  }

  updatePayroll(updatedPayroll: PayrollRecord): void {
    const index = this.payroll.findIndex((payroll) => payroll.id === updatedPayroll.id);

    if (index === -1) {
      return;
    }

    this.payroll[index] = updatedPayroll;

    this.savePayroll();
  }

  processPayroll(id: string): void {
    const payroll = this.getPayrollById(id);

    if (!payroll) {
      return;
    }

    payroll.status = 'Processed';

    if (!payroll.paymentDate) {
      payroll.paymentDate = this.getToday();
    }

    this.savePayroll();
  }

  deletePayroll(id: string): void {
    this.payroll = this.payroll.filter((payroll) => payroll.id !== id);

    this.savePayroll();
  }

  calculateGrossSalary(basicSalary: number, allowances: number): number {
    return basicSalary + allowances;
  }

  calculateNetSalary(grossSalary: number, deductions: number): number {
    return grossSalary - deductions;
  }

  generatePayrollId(): string {
    const numbers = this.payroll.map((payroll) => {
      const match = payroll.id.match(/^PAY(\d+)$/);

      return match ? Number(match[1]) : 0;
    });

    const nextNumber = Math.max(0, ...numbers) + 1;

    return `PAY${String(nextNumber).padStart(3, '0')}`;
  }

  getToday(): string {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private savePayroll(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.payroll));
  }

  private loadPayroll(): void {
    const savedPayroll = localStorage.getItem(this.storageKey);

    if (!savedPayroll) {
      this.createDefaultPayroll();

      this.savePayroll();

      return;
    }

    try {
      const parsedPayroll = JSON.parse(savedPayroll);

      if (Array.isArray(parsedPayroll)) {
        this.payroll = parsedPayroll;
      } else {
        this.createDefaultPayroll();

        this.savePayroll();
      }
    } catch {
      this.createDefaultPayroll();

      this.savePayroll();
    }
  }

  private createDefaultPayroll(): void {
    this.payroll = [
      {
        id: 'PAY001',
        employeeId: 'EMP001',
        employeeName: 'Aditya Sharma',
        department: 'IT',
        month: 'September 2026',
        basicSalary: 50000,
        allowances: 10000,
        deductions: 5000,
        grossSalary: 60000,
        netSalary: 55000,
        status: 'Processed',
        paymentDate: '2026-09-30',
      },

      {
        id: 'PAY002',
        employeeId: 'EMP002',
        employeeName: 'Rahul Kumar',
        department: 'HR',
        month: 'September 2026',
        basicSalary: 42000,
        allowances: 8000,
        deductions: 4000,
        grossSalary: 50000,
        netSalary: 46000,
        status: 'Processed',
        paymentDate: '2026-09-30',
      },

      {
        id: 'PAY003',
        employeeId: 'EMP003',
        employeeName: 'Priya Singh',
        department: 'Finance',
        month: 'September 2026',
        basicSalary: 45000,
        allowances: 7000,
        deductions: 3500,
        grossSalary: 52000,
        netSalary: 48500,
        status: 'Processed',
        paymentDate: '2026-09-30',
      },

      {
        id: 'PAY004',
        employeeId: 'EMP004',
        employeeName: 'Ananya Mehta',
        department: 'Marketing',
        month: 'September 2026',
        basicSalary: 40000,
        allowances: 6000,
        deductions: 3000,
        grossSalary: 46000,
        netSalary: 43000,
        status: 'Pending',
        paymentDate: '',
      },
    ];
  }
}
