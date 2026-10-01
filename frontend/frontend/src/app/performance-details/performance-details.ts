
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Employee,
  EmployeeService
} from '../services/employee.service';

import {
  PerformanceRecord,
  PerformanceService
} from '../services/performance.service';

@Component({
  selector: 'app-performance-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './performance-details.html',
  styleUrl: './performance-details.css'
})
export class PerformanceDetailsComponent implements OnInit {

  employees: Employee[] = [];

  selectedEmployeeData: Employee | undefined;

  performanceId = '';

  isEditMode = false;

  selectedEmployeeId = '';

  reviewPeriod = '';

  manager = '';

  rating = 0;

  goalsCompleted = 0;

  totalGoals = 1;

  goalPercentage = 0;

  status: PerformanceRecord['status'] = 'Pending';

  comments = '';

  existingRecord: PerformanceRecord | undefined;

  loadingEmployees = false;

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private performanceService: PerformanceService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {

    this.loadEmployees();

    this.loadPerformance();
  }

  /*
   * LOAD EMPLOYEES FROM BACKEND
   */

  loadEmployees(): void {

    this.loadingEmployees = true;

    this.employeeService.getEmployees().subscribe({

      next: (employees: Employee[]) => {

        this.employees = employees;

        this.loadingEmployees = false;

        /*
         * If editing an existing performance record,
         * find the selected employee after employees
         * have been loaded.
         */

        if (this.selectedEmployeeId) {

          this.setSelectedEmployee(
            this.selectedEmployeeId
          );
        }
      },

      error: (error: any) => {

        console.error(
          'Failed to load employees:',
          error
        );

        this.loadingEmployees = false;

        this.errorMessage =
          'Unable to load employees from backend.';
      }
    });
  }

  /*
   * SELECTED EMPLOYEE
   *
   * Do NOT call getEmployeeById() here because
   * it now returns Observable<Employee>.
   */

  get selectedEmployee(): Employee | undefined {

    return this.selectedEmployeeData;
  }

  /*
   * WHEN EMPLOYEE CHANGES
   */

  onEmployeeChange(): void {

    this.setSelectedEmployee(
      this.selectedEmployeeId
    );
  }

  /*
   * FIND EMPLOYEE FROM ALREADY LOADED ARRAY
   */

  private setSelectedEmployee(
    employeeId: string
  ): void {

    this.selectedEmployeeData =
      this.employees.find(
        (employee: Employee) =>
          employee.id === employeeId
      );
  }

  /*
   * LOAD PERFORMANCE RECORD
   */

  loadPerformance(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    /*
     * CREATE MODE
     */

    if (!id) {

      this.performanceId = '';

      this.isEditMode = false;

      this.status = 'Pending';

      this.rating = 0;

      this.goalsCompleted = 0;

      this.totalGoals = 1;

      this.calculateGoalPercentage();

      return;
    }

    /*
     * EDIT MODE
     */

    this.performanceId = id;

    this.isEditMode = true;

    this.existingRecord =
      this.performanceService.getPerformanceById(id);

    if (!this.existingRecord) {

      alert(
        'Performance review not found.'
      );

      this.router.navigate([
        '/performance'
      ]);

      return;
    }

    this.selectedEmployeeId =
      this.existingRecord.employeeId;

    this.reviewPeriod =
      this.existingRecord.reviewPeriod;

    this.manager =
      this.existingRecord.manager;

    this.rating =
      this.existingRecord.rating;

    this.goalsCompleted =
      this.existingRecord.goalsCompleted;

    this.totalGoals =
      this.existingRecord.totalGoals;

    this.status =
      this.existingRecord.status;

    this.comments =
      this.existingRecord.comments;

    /*
     * Employee list may still be loading.
     * If already loaded, select employee now.
     */

    this.setSelectedEmployee(
      this.selectedEmployeeId
    );

    this.calculateGoalPercentage();
  }

  /*
   * READ ONLY WHEN COMPLETED
   */

  get isReadOnly(): boolean {

    if (!this.existingRecord) {

      return false;
    }

    return (
      this.existingRecord.status ===
      'Completed'
    );
  }

  /*
   * CALCULATE GOAL PERCENTAGE
   */

  calculateGoalPercentage(): void {

    this.goalsCompleted =
      Number(this.goalsCompleted) || 0;

    this.totalGoals =
      Number(this.totalGoals) || 0;

    if (this.totalGoals < 1) {

      this.totalGoals = 1;
    }

    if (this.goalsCompleted < 0) {

      this.goalsCompleted = 0;
    }

    if (
      this.goalsCompleted >
      this.totalGoals
    ) {

      this.goalsCompleted =
        this.totalGoals;
    }

    this.goalPercentage =
      this.performanceService.calculateGoalPercentage(
        this.goalsCompleted,
        this.totalGoals
      );
  }

  /*
   * STAR RATING
   */

  getStars(
    rating: number
  ): string[] {

    const stars: string[] = [];

    const roundedRating =
      Math.round(rating);

    for (
      let index = 1;
      index <= 5;
      index++
    ) {

      stars.push(
        index <= roundedRating
          ? 'filled'
          : 'empty'
      );
    }

    return stars;
  }

  /*
   * SAVE PERFORMANCE
   */

  savePerformance(): void {

    if (this.isReadOnly) {

      alert(
        'Completed performance reviews cannot be edited.'
      );

      return;
    }

    /*
     * REQUIRED FIELDS
     */

    if (
      !this.selectedEmployeeId ||
      !this.reviewPeriod ||
      !this.manager.trim()
    ) {

      alert(
        'Please fill in all required employee and review fields.'
      );

      return;
    }

    /*
     * FIND EMPLOYEE FROM LOADED ARRAY
     */

    const employee =
      this.selectedEmployee;

    if (!employee) {

      alert(
        'Employee not found.'
      );

      return;
    }

    /*
     * RATING VALIDATION
     */

    this.rating =
      Number(this.rating) || 0;

    if (
      this.rating < 0 ||
      this.rating > 5
    ) {

      alert(
        'Performance rating must be between 0 and 5.'
      );

      return;
    }

    /*
     * GOAL CALCULATION
     */

    this.calculateGoalPercentage();

    if (this.totalGoals <= 0) {

      alert(
        'Total goals must be greater than zero.'
      );

      return;
    }

    if (
      this.goalsCompleted < 0 ||
      this.goalsCompleted >
        this.totalGoals
    ) {

      alert(
        'Completed goals cannot exceed total goals.'
      );

      return;
    }

    /*
     * UPDATE
     */

    if (this.isEditMode) {

      this.updatePerformance(
        employee
      );

      return;
    }

    /*
     * CHECK DUPLICATE
     */

    const duplicate =
      this.performanceService
        .getPerformance()
        .find(
          (record: PerformanceRecord) =>
            record.employeeId ===
              employee.id &&
            record.reviewPeriod ===
              this.reviewPeriod
        );

    if (duplicate) {

      alert(
        `${employee.name} already has a performance review for ${this.reviewPeriod}.`
      );

      return;
    }

    /*
     * CREATE PERFORMANCE RECORD
     */

    const performance:
      PerformanceRecord = {

      id:
        this.performanceService
          .generatePerformanceId(),

      employeeId:
        employee.id,

      employeeName:
        employee.name,

      department:
        employee.department,

      reviewPeriod:
        this.reviewPeriod,

      rating:
        this.rating,

      goalsCompleted:
        this.goalsCompleted,

      totalGoals:
        this.totalGoals,

      manager:
        this.manager.trim(),

      status:
        this.status,

      comments:
        this.comments.trim()
    };

    this.performanceService
      .addPerformance(
        performance
      );

    alert(
      'Performance review created successfully!'
    );

    this.router.navigate([
      '/performance'
    ]);
  }

  /*
   * UPDATE PERFORMANCE
   */

  updatePerformance(
    employee: Employee
  ): void {

    if (!this.existingRecord) {

      return;
    }

    /*
     * CHECK DUPLICATE
     */

    const duplicate =
      this.performanceService
        .getPerformance()
        .find(
          (record: PerformanceRecord) =>

            record.id !==
              this.performanceId &&

            record.employeeId ===
              employee.id &&

            record.reviewPeriod ===
              this.reviewPeriod
        );

    if (duplicate) {

      alert(
        `${employee.name} already has another performance review for ${this.reviewPeriod}.`
      );

      return;
    }

    /*
     * UPDATED RECORD
     */

    const updatedRecord:
      PerformanceRecord = {

      ...this.existingRecord,

      employeeId:
        employee.id,

      employeeName:
        employee.name,

      department:
        employee.department,

      reviewPeriod:
        this.reviewPeriod,

      rating:
        this.rating,

      goalsCompleted:
        this.goalsCompleted,

      totalGoals:
        this.totalGoals,

      manager:
        this.manager.trim(),

      status:
        this.status,

      comments:
        this.comments.trim()
    };

    this.performanceService
      .updatePerformance(
        updatedRecord
      );

    alert(
      'Performance review updated successfully!'
    );

    this.router.navigate([
      '/performance'
    ]);
  }

  /*
   * CANCEL
   */

  cancel(): void {

    this.router.navigate([
      '/performance'
    ]);
  }
}
