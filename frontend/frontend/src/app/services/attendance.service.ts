import { Injectable } from '@angular/core';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave';

export interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  remarks: string;
}

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private readonly storageKey = 'hrgenius_attendance';

  private attendance: AttendanceRecord[] = [];

  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor() {
    this.loadAttendance();
  }

  // ==========================================
  // GET ALL ATTENDANCE
  // ==========================================

  getAttendance(): AttendanceRecord[] {
    return [...this.attendance];
  }

  // ==========================================
  // GET ATTENDANCE BY DATE
  // ==========================================

  getAttendanceByDate(date: string): AttendanceRecord[] {
    return this.attendance.filter((record) => record.date === date);
  }

  // ==========================================
  // GET EMPLOYEE ATTENDANCE
  // ==========================================

  getEmployeeAttendance(employeeId: string, date: string): AttendanceRecord | undefined {
    return this.attendance.find(
      (record) => record.employeeId === employeeId && record.date === date,
    );
  }

  // ==========================================
  // MARK ATTENDANCE
  // ==========================================

  markAttendance(record: AttendanceRecord): void {
    const existingIndex = this.attendance.findIndex(
      (item) => item.employeeId === record.employeeId && item.date === record.date,
    );

    if (existingIndex !== -1) {
      this.attendance[existingIndex] = {
        ...record,
      };
    } else {
      this.attendance.push({
        ...record,
      });
    }

    this.saveAttendance();
  }

  // ==========================================
  // UPDATE ATTENDANCE
  // ==========================================

  updateAttendance(updatedRecord: AttendanceRecord): void {
    const index = this.attendance.findIndex(
      (record) =>
        record.employeeId === updatedRecord.employeeId && record.date === updatedRecord.date,
    );

    if (index !== -1) {
      this.attendance[index] = {
        ...updatedRecord,
      };

      this.saveAttendance();
    }
  }

  // ==========================================
  // DELETE ATTENDANCE
  // ==========================================

  deleteAttendance(employeeId: string, date: string): void {
    this.attendance = this.attendance.filter(
      (record) => !(record.employeeId === employeeId && record.date === date),
    );

    this.saveAttendance();
  }

  // ==========================================
  // GET TODAY
  // ==========================================

  getToday(): string {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // ==========================================
  // SAVE TO LOCAL STORAGE
  // ==========================================

  private saveAttendance(): void {
    localStorage.setItem(
      this.storageKey,

      JSON.stringify(this.attendance),
    );
  }

  // ==========================================
  // LOAD FROM LOCAL STORAGE
  // ==========================================

  private loadAttendance(): void {
    const savedAttendance = localStorage.getItem(this.storageKey);

    if (!savedAttendance) {
      this.createDefaultAttendance();

      this.saveAttendance();

      return;
    }

    try {
      const parsedAttendance = JSON.parse(savedAttendance);

      if (Array.isArray(parsedAttendance)) {
        this.attendance = parsedAttendance;
      } else {
        this.createDefaultAttendance();

        this.saveAttendance();
      }
    } catch {
      this.createDefaultAttendance();

      this.saveAttendance();
    }
  }

  // ==========================================
  // DEFAULT ATTENDANCE
  // ==========================================

  private createDefaultAttendance(): void {
    const today = this.getToday();

    this.attendance = [
      {
        employeeId: 'EMP001',
        employeeName: 'Aditya Sharma',
        department: 'IT',
        date: today,
        checkIn: '09:05 AM',
        checkOut: '06:10 PM',
        status: 'Present',
        remarks: '',
      },

      {
        employeeId: 'EMP002',
        employeeName: 'Rahul Kumar',
        department: 'HR',
        date: today,
        checkIn: '09:20 AM',
        checkOut: '06:00 PM',
        status: 'Late',
        remarks: 'Slightly late',
      },

      {
        employeeId: 'EMP003',
        employeeName: 'Priya Singh',
        department: 'Finance',
        date: today,
        checkIn: '—',
        checkOut: '—',
        status: 'Absent',
        remarks: '',
      },

      {
        employeeId: 'EMP004',
        employeeName: 'Ananya Mehta',
        department: 'Marketing',
        date: today,
        checkIn: '—',
        checkOut: '—',
        status: 'On Leave',
        remarks: 'Approved leave',
      },
    ];
  }
}
