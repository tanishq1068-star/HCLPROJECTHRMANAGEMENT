import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LeaveBalance, LeaveRecord, LeaveService } from '../services/leave.service';

import { Employee, EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-leave-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './leave-details.html',
  styleUrl: './leave-details.css',
})
export class LeaveDetailsComponent {
  leaveId = '';
  isEditMode = false;

  employees: Employee[] = [];

  selectedEmployeeId = '';
  leaveType = '';
  startDate = '';
  endDate = '';
  reason = '';

  days = 0;

  leaveTypes = ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Unpaid Leave'];

  existingLeave: LeaveRecord | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
  ) {
   this.employeeService.getEmployees().subscribe({
     next: (employees: Employee[]) => {
       this.employees = employees;
     },
     error: (error: any) => {
       console.error('Failed to load employees:', error);
     },
   });

    this.loadLeave();
  }

  loadLeave(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.leaveId = id;
    this.isEditMode = true;

    this.existingLeave = this.leaveService.getLeaveById(id);

    if (!this.existingLeave) {
      alert('Leave request not found.');
      this.router.navigate(['/leave-management']);
      return;
    }

    this.selectedEmployeeId = this.existingLeave.employeeId;

    this.leaveType = this.existingLeave.leaveType;

    this.startDate = this.existingLeave.startDate;

    this.endDate = this.existingLeave.endDate;

    this.reason = this.existingLeave.reason;

    this.calculateDays();
  }

  get isReadOnly(): boolean {
    if (!this.existingLeave) {
      return false;
    }

    return this.existingLeave.status === 'Approved' || this.existingLeave.status === 'Rejected';
  }

  selectedEmployee: Employee | undefined;

  loadSelectedEmployee(): void {
    if (!this.selectedEmployeeId) {
      this.selectedEmployee = undefined;
      return;
    }

    this.employeeService.getEmployeeById(this.selectedEmployeeId).subscribe({
      next: (employee: Employee) => {
        this.selectedEmployee = employee;
      },
      error: (error: any) => {
        console.error('Failed to load employee:', error);
        this.selectedEmployee = undefined;
      },
    });
  }
  get leaveBalance(): LeaveBalance | null {
    if (!this.selectedEmployeeId) {
      return null;
    }

    return this.leaveService.getLeaveBalance(this.selectedEmployeeId);
  }

  get availableDays(): number {
    const balance = this.leaveBalance;

    if (!balance) {
      return 0;
    }

    switch (this.leaveType) {
      case 'Casual Leave':
        return balance.casualLeave;

      case 'Sick Leave':
        return balance.sickLeave;

      case 'Earned Leave':
        return balance.earnedLeave;

      default:
        return balance.totalRemaining;
    }
  }

  onDateChange(): void {
    if (this.isReadOnly) {
      return;
    }

    this.calculateDays();
  }

  calculateDays(): void {
    if (!this.startDate || !this.endDate) {
      this.days = 0;
      return;
    }

    const start = new Date(`${this.startDate}T00:00:00`);

    const end = new Date(`${this.endDate}T00:00:00`);

    if (end < start) {
      this.days = 0;
      return;
    }

    const difference = end.getTime() - start.getTime();

    this.days = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;
  }

  saveLeave(): void {
    if (this.isReadOnly) {
      alert('Approved or rejected leave requests cannot be edited.');
      return;
    }

    if (!this.selectedEmployeeId || !this.leaveType || !this.startDate || !this.endDate) {
      alert('Please fill in all required leave fields.');
      return;
    }

    const employee = this.selectedEmployee;

    if (!employee) {
      alert('Employee not found.');
      return;
    }

    const start = new Date(`${this.startDate}T00:00:00`);

    const end = new Date(`${this.endDate}T00:00:00`);

    if (end < start) {
      alert('End date cannot be earlier than start date.');
      return;
    }

    this.calculateDays();

    if (this.days <= 0) {
      alert('Please select valid leave dates.');
      return;
    }

    const availableDays = this.getAvailableDaysForRequest();

    if (this.leaveType !== 'Unpaid Leave' && this.days > availableDays) {
      alert(`You have only ${availableDays} days of ${this.leaveType} remaining.`);
      return;
    }

    if (this.isEditMode) {
      this.updateLeave(employee);
      return;
    }

    const leave: LeaveRecord = {
      id: this.generateLeaveId(),
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      leaveType: this.leaveType,
      startDate: this.startDate,
      endDate: this.endDate,
      days: this.days,
      reason: this.reason.trim(),
      appliedDate: this.getToday(),
      status: 'Pending',
    };

    this.leaveService.addLeave(leave);

    alert('Leave request submitted successfully!');

    this.router.navigate(['/leave-management']);
  }

  updateLeave(employee: Employee): void {
    if (!this.existingLeave) {
      return;
    }

    const updatedLeave: LeaveRecord = {
      ...this.existingLeave,
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      leaveType: this.leaveType,
      startDate: this.startDate,
      endDate: this.endDate,
      days: this.days,
      reason: this.reason.trim(),
    };

    this.leaveService.updateLeave(updatedLeave);

    alert('Leave request updated successfully!');

    this.router.navigate(['/leave-management']);
  }

  getAvailableDaysForRequest(): number {
    if (!this.leaveBalance) {
      return 0;
    }

    let available = this.availableDays;

    if (
      this.isEditMode &&
      this.existingLeave &&
      this.existingLeave.status === 'Approved' &&
      this.existingLeave.employeeId === this.selectedEmployeeId &&
      this.existingLeave.leaveType === this.leaveType
    ) {
      available += this.existingLeave.days;
    }

    return available;
  }

  generateLeaveId(): string {
    const leaves = this.leaveService.getLeaves();

    const numbers = leaves.map((leave) => {
      const match = leave.id.match(/^LV(\d+)$/);

      return match ? Number(match[1]) : 0;
    });

    const nextNumber = Math.max(0, ...numbers) + 1;

    return `LV${String(nextNumber).padStart(3, '0')}`;
  }

  getToday(): string {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  cancel(): void {
    this.router.navigate(['/leave-management']);
  }
}
