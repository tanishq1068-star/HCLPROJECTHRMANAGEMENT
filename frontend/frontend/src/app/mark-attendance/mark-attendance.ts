import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Employee, EmployeeService } from '../services/employee.service';

import { AttendanceRecord, AttendanceService } from '../services/attendance.service';

@Component({
  selector: 'app-mark-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mark-attendance.html',
  styleUrl: './mark-attendance.css',
})
export class MarkAttendanceComponent implements OnInit {
  employees: Employee[] = [];

  selectedEmployeeId = '';

  selectedDate = '';

  selectedStatus: AttendanceRecord['status'] | '' = '';

  checkIn = '';

  checkOut = '';

  remarks = '';

  isEditMode = false;

  statusOptions: AttendanceRecord['status'][] = [
    'Present',
    'Absent',
    'Late',
    'Half Day',
    'On Leave',
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.selectedDate = this.attendanceService.getToday();

    this.loadEmployees();

    this.loadAttendanceForEdit();
  }

  /**
   * Load employees from backend
   */
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
      },

      error: (error: any) => {
        console.error('Failed to load employees:', error);
        alert('Unable to load employees from backend.');
      },
    });
  }

  /**
   * Load existing attendance when editing
   */
  loadAttendanceForEdit(): void {
    const employeeId = this.route.snapshot.queryParamMap.get('employeeId');

    const date = this.route.snapshot.queryParamMap.get('date');

    if (!employeeId || !date) {
      return;
    }

    const existingRecord = this.attendanceService.getEmployeeAttendance(employeeId, date);

    if (!existingRecord) {
      alert('Attendance record not found.');

      this.router.navigate(['/attendance']);

      return;
    }

    this.selectedEmployeeId = existingRecord.employeeId;

    this.selectedDate = existingRecord.date;

    this.selectedStatus = existingRecord.status;

    this.checkIn = this.convertToTimeInput(existingRecord.checkIn);

    this.checkOut = this.convertToTimeInput(existingRecord.checkOut);

    this.remarks = existingRecord.remarks || '';

    this.isEditMode = true;
  }

  /**
   * Handle status changes
   */
  onStatusChange(): void {
    if (this.selectedStatus === 'Absent' || this.selectedStatus === 'On Leave') {
      this.checkIn = '';
      this.checkOut = '';
    }
  }

  /**
   * Validate check-in/check-out
   */
  onCheckInChange(): void {
    if (this.checkOut && this.checkIn && this.checkOut <= this.checkIn) {
      this.checkOut = '';
    }
  }

  /**
   * Save attendance
   */
  saveAttendance(): void {
    if (!this.selectedEmployeeId || !this.selectedDate || !this.selectedStatus) {
      alert('Please select employee, date and attendance status.');

      return;
    }

    /*
     * IMPORTANT:
     *
     * getEmployeeById() returns Observable<Employee>,
     * so we MUST subscribe to it.
     */
    this.employeeService.getEmployeeById(this.selectedEmployeeId).subscribe({
      next: (employee: Employee) => {
        this.saveEmployeeAttendance(employee);
      },

      error: (error: any) => {
        console.error('Failed to load employee:', error);

        alert('Employee not found.');
      },
    });
  }

  /**
   * Create and save attendance after employee is loaded
   */
  private saveEmployeeAttendance(employee: Employee): void {
    /*
     * Validate check-in for working statuses
     */
    if (
      this.selectedStatus === 'Present' ||
      this.selectedStatus === 'Late' ||
      this.selectedStatus === 'Half Day'
    ) {
      if (!this.checkIn) {
        alert('Please enter check-in time for this attendance status.');

        return;
      }
    }

    /*
     * Check-out must be after check-in
     */
    if (this.checkOut && this.checkIn && this.checkOut <= this.checkIn) {
      alert('Check-out time must be later than check-in time.');

      return;
    }

    /*
     * Absent / On Leave cannot have check-in/check-out
     */
    if (this.selectedStatus === 'Absent' || this.selectedStatus === 'On Leave') {
      this.checkIn = '';
      this.checkOut = '';
    }

    /*
     * Check whether attendance already exists
     */
    const existingRecord = this.attendanceService.getEmployeeAttendance(
      this.selectedEmployeeId,
      this.selectedDate,
    );

    if (!this.isEditMode && existingRecord) {
      alert('Attendance for this employee already exists for the selected date.');

      return;
    }

    /*
     * Create attendance object
     */
    const attendanceRecord: AttendanceRecord = {
      employeeId: employee.id,

      employeeName: employee.name,

      department: employee.department,

      date: this.selectedDate,

      checkIn: this.checkIn ? this.formatTime(this.checkIn) : '—',

      checkOut: this.checkOut ? this.formatTime(this.checkOut) : '—',

      status: this.selectedStatus as AttendanceRecord['status'],

      remarks: this.remarks.trim(),
    };

    /*
     * Save attendance
     */
    this.attendanceService.markAttendance(attendanceRecord);

    /*
     * Success message
     */
    alert(this.isEditMode ? 'Attendance updated successfully!' : 'Attendance marked successfully!');

    /*
     * Navigate back
     */
    this.router.navigate(['/attendance']);
  }

  /**
   * Convert 24-hour time to AM/PM
   */
  formatTime(time: string): string {
    if (!time) {
      return '—';
    }

    const [hours, minutes] = time.split(':').map(Number);

    const period = hours >= 12 ? 'PM' : 'AM';

    const displayHours = hours % 12 || 12;

    return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  /**
   * Convert AM/PM time to HTML time input format
   */
  convertToTimeInput(time: string): string {
    if (!time || time === '—') {
      return '';
    }

    const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);

    if (!match) {
      return '';
    }

    let hours = Number(match[1]);

    const minutes = match[2];

    const period = match[3].toUpperCase();

    if (period === 'AM') {
      if (hours === 12) {
        hours = 0;
      }
    } else {
      if (hours !== 12) {
        hours += 12;
      }
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  /**
   * Cancel and return to attendance page
   */
  cancel(): void {
    this.router.navigate(['/attendance']);
  }
}
