import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AttendanceService,
  AttendanceRecord,
  AttendanceStatus,
} from '../services/attendance.service';

import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css',
})
export class AttendanceComponent implements OnInit {
  // ==========================================
  // EMPLOYEES
  // ==========================================

  employees: any[] = [];

  // ==========================================
  // ATTENDANCE
  // ==========================================

  attendanceRecords: AttendanceRecord[] = [];

  filteredRecords: AttendanceRecord[] = [];

  // ==========================================
  // FILTERS
  // ==========================================

  filterDate = '';

  filterEmployee = '';

  filterStatus = '';

  // ==========================================
  // MODAL
  // ==========================================

  showModal = false;

  // ==========================================
  // ATTENDANCE FORM
  // ==========================================

  attendance: AttendanceRecord = {
    employeeId: '',
    employeeName: '',
    department: '',
    date: '',
    checkIn: '',
    checkOut: '',
    status: 'Present',
    remarks: '',
  };

  // ==========================================
  // STATUS OPTIONS
  // ==========================================

  statuses: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Half Day', 'On Leave'];

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
  ) {}

  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {
    this.loadEmployees();

    this.loadAttendance();
  }

  // ==========================================
  // LOAD EMPLOYEES
  // ==========================================

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees: any[]) => {
        this.employees = employees || [];
      },

      error: (error) => {
        console.error('Error loading employees:', error);

        this.employees = [];
      },
    });
  }

  // ==========================================
  // LOAD ATTENDANCE
  // ==========================================

  loadAttendance(): void {
    this.attendanceRecords = this.attendanceService.getAttendance();

    this.applyFilters();
  }

  // ==========================================
  // OPEN ATTENDANCE MODAL
  // ==========================================

  openAttendanceModal(): void {
    this.attendance = {
      employeeId: '',

      employeeName: '',

      department: '',

      date: this.attendanceService.getToday(),

      checkIn: '',

      checkOut: '',

      status: 'Present',

      remarks: '',
    };

    this.showModal = true;
  }

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  closeModal(): void {
    this.showModal = false;
  }

  // ==========================================
  // EMPLOYEE SELECTED
  // ==========================================

  onEmployeeChange(): void {
    const selectedEmployee = this.employees.find(
      (employee) =>
        String(employee.employeeId || employee.id) === String(this.attendance.employeeId),
    );

    if (!selectedEmployee) {
      return;
    }

    this.attendance.employeeName =
      selectedEmployee.name || selectedEmployee.fullName || selectedEmployee.employeeName || '';

    this.attendance.department =
      selectedEmployee.department || selectedEmployee.departmentName || '';

    /*
     * If EmployeeService uses EMP001-style IDs,
     * keep that value.
     */

    if (selectedEmployee.employeeId) {
      this.attendance.employeeId = selectedEmployee.employeeId;
    }
  }

  // ==========================================
  // SAVE ATTENDANCE
  // ==========================================

  saveAttendance(): void {
    if (!this.attendance.employeeId) {
      alert('Please select an employee.');

      return;
    }

    if (!this.attendance.date) {
      alert('Please select a date.');

      return;
    }

    if (!this.attendance.status) {
      alert('Please select attendance status.');

      return;
    }

    /*
     * Make sure employee information
     * is populated before saving.
     */

    this.onEmployeeChange();

    /*
     * Save through AttendanceService.
     */

    this.attendanceService.markAttendance({
      ...this.attendance,
    });

    /*
     * Refresh records.
     */

    this.loadAttendance();

    /*
     * Close modal.
     */

    this.closeModal();

    alert('Attendance saved successfully.');
  }

  // ==========================================
  // FILTER ATTENDANCE
  // ==========================================

  applyFilters(): void {
    let records = [...this.attendanceRecords];

    // Date filter

    if (this.filterDate) {
      records = records.filter((record) => record.date === this.filterDate);
    }

    // Employee filter

    if (this.filterEmployee) {
      records = records.filter(
        (record) => String(record.employeeId) === String(this.filterEmployee),
      );
    }

    // Status filter

    if (this.filterStatus) {
      records = records.filter((record) => record.status === this.filterStatus);
    }

    this.filteredRecords = records;
  }

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  clearFilters(): void {
    this.filterDate = '';

    this.filterEmployee = '';

    this.filterStatus = '';

    this.applyFilters();
  }

  // ==========================================
  // DELETE ATTENDANCE
  // ==========================================

  deleteAttendance(record: AttendanceRecord): void {
    const confirmed = confirm(
      `Are you sure you want to delete attendance for ${record.employeeName} on ${record.date}?`,
    );

    if (!confirmed) {
      return;
    }

    this.attendanceService.deleteAttendance(
      record.employeeId,

      record.date,
    );

    this.loadAttendance();
  }

  // ==========================================
  // EDIT ATTENDANCE
  // ==========================================

  editAttendance(record: AttendanceRecord): void {
    this.attendance = {
      ...record,
    };

    this.showModal = true;
  }

  // ==========================================
  // TOTAL MARKED
  // ==========================================

  get totalMarked(): number {
    return this.attendanceRecords.length;
  }

  // ==========================================
  // TOTAL PRESENT
  // ==========================================

  get totalPresent(): number {
    return this.attendanceRecords.filter((record) => record.status === 'Present').length;
  }

  // ==========================================
  // TOTAL ABSENT
  // ==========================================

  get totalAbsent(): number {
    return this.attendanceRecords.filter((record) => record.status === 'Absent').length;
  }

  // ==========================================
  // TOTAL LATE
  // ==========================================

  get totalLate(): number {
    return this.attendanceRecords.filter((record) => record.status === 'Late').length;
  }

  // ==========================================
  // TODAY
  // ==========================================

  getToday(): string {
    return this.attendanceService.getToday();
  }
}
