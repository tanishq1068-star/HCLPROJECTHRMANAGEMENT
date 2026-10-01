import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { PerformanceRecord, PerformanceService } from '../services/performance.service';

@Component({
  selector: 'app-performance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './performance.html',
  styleUrl: './performance.css',
})
export class PerformanceComponent {
  searchText = '';
  statusFilter = 'All Status';

  performance: PerformanceRecord[] = [];

  constructor(private performanceService: PerformanceService) {
    this.loadPerformance();
  }

  loadPerformance(): void {
    this.performance = this.performanceService.getPerformance();
  }

  get filteredPerformance(): PerformanceRecord[] {
    const search = this.searchText.toLowerCase().trim();

    return this.performance.filter((record) => {
      const matchesSearch =
        !search ||
        record.id.toLowerCase().includes(search) ||
        record.employeeId.toLowerCase().includes(search) ||
        record.employeeName.toLowerCase().includes(search) ||
        record.department.toLowerCase().includes(search) ||
        record.manager.toLowerCase().includes(search);

      const matchesStatus =
        this.statusFilter === 'All Status' || record.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  get totalReviews(): number {
    return this.performance.length;
  }

  get averageRating(): number {
    return this.performanceService.getAverageRating();
  }

  get completedCount(): number {
    return this.performance.filter((record) => record.status === 'Completed').length;
  }

  get inProgressCount(): number {
    return this.performance.filter((record) => record.status === 'In Progress').length;
  }

  get pendingCount(): number {
    return this.performance.filter((record) => record.status === 'Pending').length;
  }

  getGoalPercentage(record: PerformanceRecord): number {
    return this.performanceService.calculateGoalPercentage(
      record.goalsCompleted,
      record.totalGoals,
    );
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];

    const roundedRating = Math.round(rating);

    for (let index = 1; index <= 5; index++) {
      stars.push(index <= roundedRating ? 'filled' : 'empty');
    }

    return stars;
  }

  deletePerformance(id: string): void {
    const record = this.performanceService.getPerformanceById(id);

    if (!record) {
      alert('Performance review not found.');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete the performance review for ${record.employeeName}?`,
    );

    if (!confirmed) {
      return;
    }

    this.performanceService.deletePerformance(id);

    this.loadPerformance();

    alert('Performance review deleted successfully.');
  }
}
