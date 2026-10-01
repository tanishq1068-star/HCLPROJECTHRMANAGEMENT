import { Injectable } from '@angular/core';

export type PerformanceStatus = 'Completed' | 'In Progress' | 'Pending';

export interface PerformanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reviewPeriod: string;
  rating: number;
  goalsCompleted: number;
  totalGoals: number;
  manager: string;
  status: PerformanceStatus;
  comments: string;
}

@Injectable({
  providedIn: 'root',
})
export class PerformanceService {
  private readonly storageKey = 'hrgenius_performance';

  private performance: PerformanceRecord[] = [];

  constructor() {
    this.loadPerformance();
  }

  getPerformance(): PerformanceRecord[] {
    return this.performance;
  }

  getPerformanceById(id: string): PerformanceRecord | undefined {
    return this.performance.find((record) => record.id === id);
  }

  getEmployeePerformance(employeeId: string): PerformanceRecord[] {
    return this.performance.filter((record) => record.employeeId === employeeId);
  }

  addPerformance(record: PerformanceRecord): void {
    this.performance.push(record);

    this.savePerformance();
  }

  updatePerformance(updatedRecord: PerformanceRecord): void {
    const index = this.performance.findIndex((record) => record.id === updatedRecord.id);

    if (index === -1) {
      return;
    }

    this.performance[index] = updatedRecord;

    this.savePerformance();
  }

  deletePerformance(id: string): void {
    this.performance = this.performance.filter((record) => record.id !== id);

    this.savePerformance();
  }

  generatePerformanceId(): string {
    const numbers = this.performance.map((record) => {
      const match = record.id.match(/^PERF(\d+)$/);

      return match ? Number(match[1]) : 0;
    });

    const nextNumber = Math.max(0, ...numbers) + 1;

    return `PERF${String(nextNumber).padStart(3, '0')}`;
  }

  calculateGoalPercentage(goalsCompleted: number, totalGoals: number): number {
    if (totalGoals <= 0) {
      return 0;
    }

    return Math.round((goalsCompleted / totalGoals) * 100);
  }

  getAverageRating(): number {
    if (this.performance.length === 0) {
      return 0;
    }

    const total = this.performance.reduce((sum, record) => sum + record.rating, 0);

    return Number((total / this.performance.length).toFixed(1));
  }

  private savePerformance(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.performance));
  }

  private loadPerformance(): void {
    const savedPerformance = localStorage.getItem(this.storageKey);

    if (!savedPerformance) {
      this.createDefaultPerformance();

      this.savePerformance();

      return;
    }

    try {
      const parsedPerformance = JSON.parse(savedPerformance);

      if (Array.isArray(parsedPerformance)) {
        this.performance = parsedPerformance;
      } else {
        this.createDefaultPerformance();

        this.savePerformance();
      }
    } catch {
      this.createDefaultPerformance();

      this.savePerformance();
    }
  }

  private createDefaultPerformance(): void {
    this.performance = [
      {
        id: 'PERF001',
        employeeId: 'EMP001',
        employeeName: 'Aditya Sharma',
        department: 'IT',
        reviewPeriod: '2026 Annual Review',
        rating: 4.5,
        goalsCompleted: 9,
        totalGoals: 10,
        manager: 'Rajesh Verma',
        status: 'Completed',
        comments: 'Excellent technical performance and strong contribution to team projects.',
      },

      {
        id: 'PERF002',
        employeeId: 'EMP002',
        employeeName: 'Rahul Kumar',
        department: 'HR',
        reviewPeriod: '2026 Annual Review',
        rating: 4.0,
        goalsCompleted: 8,
        totalGoals: 10,
        manager: 'Neha Gupta',
        status: 'Completed',
        comments: 'Consistently handled employee relations and HR operations effectively.',
      },

      {
        id: 'PERF003',
        employeeId: 'EMP003',
        employeeName: 'Priya Singh',
        department: 'Finance',
        reviewPeriod: '2026 Annual Review',
        rating: 4.2,
        goalsCompleted: 8,
        totalGoals: 9,
        manager: 'Amit Kapoor',
        status: 'In Progress',
        comments: 'Strong financial analysis skills with good attention to detail.',
      },

      {
        id: 'PERF004',
        employeeId: 'EMP004',
        employeeName: 'Ananya Mehta',
        department: 'Marketing',
        reviewPeriod: '2026 Annual Review',
        rating: 3.8,
        goalsCompleted: 7,
        totalGoals: 10,
        manager: 'Sonia Malhotra',
        status: 'Pending',
        comments: 'Performance review is awaiting final manager feedback.',
      },
    ];
  }
}
