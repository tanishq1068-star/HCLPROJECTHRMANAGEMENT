import { Injectable } from '@angular/core';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  appliedDate: string;
  status: LeaveStatus;
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  casualLeave: number;
  sickLeave: number;
  earnedLeave: number;
  totalAllocated: number;
  totalUsed: number;
  totalRemaining: number;
}

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private readonly storageKey = 'hrgenius_leaves';

  private readonly defaultBalances: Record<
    string,
    {
      casualLeave: number;
      sickLeave: number;
      earnedLeave: number;
    }
  > = {
    EMP001: {
      casualLeave: 12,
      sickLeave: 10,
      earnedLeave: 15,
    },

    EMP002: {
      casualLeave: 12,
      sickLeave: 10,
      earnedLeave: 15,
    },

    EMP003: {
      casualLeave: 12,
      sickLeave: 10,
      earnedLeave: 15,
    },

    EMP004: {
      casualLeave: 12,
      sickLeave: 10,
      earnedLeave: 15,
    },
  };

  private leaves: LeaveRecord[] = [];

  constructor() {
    this.loadLeaves();
  }

  getLeaves(): LeaveRecord[] {
    return this.leaves;
  }

  getLeaveById(id: string): LeaveRecord | undefined {
    return this.leaves.find((leave) => leave.id === id);
  }

  addLeave(leave: LeaveRecord): void {
    this.leaves.push(leave);

    this.saveLeaves();
  }

  updateLeave(updatedLeave: LeaveRecord): void {
    const index = this.leaves.findIndex((leave) => leave.id === updatedLeave.id);

    if (index === -1) {
      return;
    }

    this.leaves[index] = updatedLeave;

    this.saveLeaves();
  }

  approveLeave(id: string): void {
    const leave = this.getLeaveById(id);

    if (!leave) {
      return;
    }

    leave.status = 'Approved';

    this.saveLeaves();
  }

  rejectLeave(id: string): void {
    const leave = this.getLeaveById(id);

    if (!leave) {
      return;
    }

    leave.status = 'Rejected';

    this.saveLeaves();
  }

  deleteLeave(id: string): void {
    this.leaves = this.leaves.filter((leave) => leave.id !== id);

    this.saveLeaves();
  }

  getLeaveBalance(employeeId: string): LeaveBalance {
    const allocation = this.defaultBalances[employeeId] || {
      casualLeave: 12,
      sickLeave: 10,
      earnedLeave: 15,
    };

    const employeeLeaves = this.leaves.filter(
      (leave) => leave.employeeId === employeeId && leave.status === 'Approved',
    );

    const casualUsed = employeeLeaves
      .filter((leave) => leave.leaveType === 'Casual Leave')
      .reduce((total, leave) => total + leave.days, 0);

    const sickUsed = employeeLeaves
      .filter((leave) => leave.leaveType === 'Sick Leave')
      .reduce((total, leave) => total + leave.days, 0);

    const earnedUsed = employeeLeaves
      .filter((leave) => leave.leaveType === 'Earned Leave')
      .reduce((total, leave) => total + leave.days, 0);

    const totalAllocated = allocation.casualLeave + allocation.sickLeave + allocation.earnedLeave;

    const totalUsed = casualUsed + sickUsed + earnedUsed;

    return {
      employeeId,

      employeeName: this.getEmployeeName(employeeId),

      casualLeave: Math.max(allocation.casualLeave - casualUsed, 0),

      sickLeave: Math.max(allocation.sickLeave - sickUsed, 0),

      earnedLeave: Math.max(allocation.earnedLeave - earnedUsed, 0),

      totalAllocated,

      totalUsed,

      totalRemaining: Math.max(totalAllocated - totalUsed, 0),
    };
  }

  getAllLeaveBalances(): LeaveBalance[] {
    const employeeIds = Object.keys(this.defaultBalances);

    return employeeIds.map((employeeId) => this.getLeaveBalance(employeeId));
  }

  generateLeaveId(): string {
    const numbers = this.leaves.map((leave) => {
      const match = leave.id.match(/^LV(\d+)$/);

      return match ? Number(match[1]) : 0;
    });

    const nextNumber = Math.max(0, ...numbers) + 1;

    return `LV${String(nextNumber).padStart(3, '0')}`;
  }

  private getEmployeeName(employeeId: string): string {
    const leave = this.leaves.find((item) => item.employeeId === employeeId);

    return leave?.employeeName || employeeId;
  }

  private saveLeaves(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.leaves));
  }

  private loadLeaves(): void {
    const savedLeaves = localStorage.getItem(this.storageKey);

    if (!savedLeaves) {
      this.createDefaultLeaves();

      this.saveLeaves();

      return;
    }

    try {
      const parsedLeaves = JSON.parse(savedLeaves);

      if (Array.isArray(parsedLeaves)) {
        this.leaves = parsedLeaves;
      } else {
        this.createDefaultLeaves();

        this.saveLeaves();
      }
    } catch {
      this.createDefaultLeaves();

      this.saveLeaves();
    }
  }

  private createDefaultLeaves(): void {
    this.leaves = [
      {
        id: 'LV001',
        employeeId: 'EMP001',
        employeeName: 'Aditya Sharma',
        department: 'IT',
        leaveType: 'Casual Leave',
        startDate: '2026-10-05',
        endDate: '2026-10-06',
        days: 2,
        reason: 'Personal work',
        appliedDate: '2026-09-25',
        status: 'Pending',
      },

      {
        id: 'LV002',
        employeeId: 'EMP002',
        employeeName: 'Rahul Kumar',
        department: 'HR',
        leaveType: 'Sick Leave',
        startDate: '2026-09-29',
        endDate: '2026-09-30',
        days: 2,
        reason: 'Medical rest',
        appliedDate: '2026-09-28',
        status: 'Approved',
      },

      {
        id: 'LV003',
        employeeId: 'EMP003',
        employeeName: 'Priya Singh',
        department: 'Finance',
        leaveType: 'Earned Leave',
        startDate: '2026-10-12',
        endDate: '2026-10-15',
        days: 4,
        reason: 'Family vacation',
        appliedDate: '2026-09-20',
        status: 'Pending',
      },

      {
        id: 'LV004',
        employeeId: 'EMP004',
        employeeName: 'Ananya Mehta',
        department: 'Marketing',
        leaveType: 'Casual Leave',
        startDate: '2026-09-22',
        endDate: '2026-09-23',
        days: 2,
        reason: 'Personal reasons',
        appliedDate: '2026-09-18',
        status: 'Rejected',
      },
    ];
  }
}
