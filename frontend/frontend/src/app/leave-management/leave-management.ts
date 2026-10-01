import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LeaveBalance, LeaveRecord, LeaveService } from '../services/leave.service';

@Component({
  selector: 'app-leave-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './leave-management.html',
  styleUrl: './leave-management.css',
})
export class LeaveManagementComponent {
  searchText = '';
  statusFilter = 'All Status';
  leaveTypeFilter = 'All Types';

  showBalances = false;

  leaves: LeaveRecord[] = [];

  constructor(private leaveService: LeaveService) {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.leaves = this.leaveService.getLeaves();
  }

  get filteredLeaves(): LeaveRecord[] {
    const search = this.searchText.toLowerCase().trim();

    return this.leaves.filter((leave) => {
      const matchesSearch =
        !search ||
        leave.id.toLowerCase().includes(search) ||
        leave.employeeId.toLowerCase().includes(search) ||
        leave.employeeName.toLowerCase().includes(search) ||
        leave.department.toLowerCase().includes(search);

      const matchesStatus =
        this.statusFilter === 'All Status' || leave.status === this.statusFilter;

      const matchesType =
        this.leaveTypeFilter === 'All Types' || leave.leaveType === this.leaveTypeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }

  get totalRequests(): number {
    return this.leaves.length;
  }

  get pendingCount(): number {
    return this.leaves.filter((leave) => leave.status === 'Pending').length;
  }

  get approvedCount(): number {
    return this.leaves.filter((leave) => leave.status === 'Approved').length;
  }

  get rejectedCount(): number {
    return this.leaves.filter((leave) => leave.status === 'Rejected').length;
  }

  get totalLeaveDays(): number {
    return this.leaves
      .filter((leave) => leave.status === 'Approved')
      .reduce((total, leave) => total + leave.days, 0);
  }

  get leaveBalances(): LeaveBalance[] {
    return this.leaveService.getAllLeaveBalances();
  }

  toggleBalances(): void {
    this.showBalances = !this.showBalances;
  }

  approveLeave(id: string): void {
    const confirmed = confirm('Are you sure you want to approve this leave request?');

    if (!confirmed) {
      return;
    }

    this.leaveService.approveLeave(id);

    this.loadLeaves();

    alert('Leave request approved successfully!');
  }

  rejectLeave(id: string): void {
    const confirmed = confirm('Are you sure you want to reject this leave request?');

    if (!confirmed) {
      return;
    }

    this.leaveService.rejectLeave(id);

    this.loadLeaves();

    alert('Leave request rejected.');
  }

  deleteLeave(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this leave request?');

    if (!confirmed) {
      return;
    }

    this.leaveService.deleteLeave(id);

    this.loadLeaves();

    alert('Leave request deleted successfully.');
  }

  formatDate(date: string): string {
    if (!date) {
      return '';
    }

    const dateObject = new Date(`${date}T00:00:00`);

    return dateObject.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getBalancePercentage(balance: LeaveBalance): number {
    if (balance.totalAllocated === 0) {
      return 0;
    }

    return Math.round((balance.totalRemaining / balance.totalAllocated) * 100);
  }
}
