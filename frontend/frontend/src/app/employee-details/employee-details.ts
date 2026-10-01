import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Employee, EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | null = null;

  loading = false;

  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
  ) {}

  ngOnInit(): void {
    /*
     * First try to get the employee that was
     * passed from the Employees page.
     */

    const navigation = this.router.getCurrentNavigation();

    const navigationEmployee = navigation?.extras?.state?.['employee'] as Employee | undefined;

    /*
     * Also check browser history state.
     * This is useful when Angular navigation
     * has already completed.
     */

    const historyEmployee = history.state?.employee as Employee | undefined;

    const employee = navigationEmployee || historyEmployee;

    if (employee) {
      console.log('Employee received from list:', employee);

      this.employee = employee;

      this.loading = false;

      return;
    }

    /*
     * If the page was refreshed directly,
     * navigation state may not exist.
     *
     * In that case, load employee from backend.
     */

    this.loadEmployeeFromBackend();
  }

  // =========================================================
  // LOAD FROM BACKEND
  // =========================================================

  private loadEmployeeFromBackend(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');

    console.log('Employee ID from URL:', employeeId);

    if (!employeeId) {
      this.errorMessage = 'Employee ID was not found.';

      this.loading = false;

      return;
    }

    this.loading = true;

    this.employeeService.getEmployeeById(employeeId).subscribe({
      next: (employee: Employee) => {
        console.log('Employee loaded from backend:', employee);

        this.employee = employee;

        this.loading = false;
      },

      error: (error: any) => {
        console.error('Unable to load employee:', error);

        this.employee = null;

        this.loading = false;

        if (error.status === 0) {
          this.errorMessage = 'Cannot connect to backend.';
        } else if (error.status === 404) {
          this.errorMessage = 'Employee was not found.';
        } else {
          this.errorMessage = 'Unable to load employee details.';
        }
      },
    });
  }

  // =========================================================
  // EDIT
  // =========================================================

  editEmployee(): void {
    if (!this.employee) {
      return;
    }

    this.router.navigate(['/add-employee'], {
      queryParams: {
        edit: this.employee.id,
      },
    });
  }

  // =========================================================
  // DELETE
  // =========================================================

  deleteEmployee(): void {
    if (!this.employee) {
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete ${this.employee.name}?`);

    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(this.employee.id).subscribe({
      next: () => {
        alert('Employee deleted successfully.');

        this.router.navigate(['/employees']);
      },

      error: (error: any) => {
        console.error('Delete employee failed:', error);

        alert('Unable to delete employee.');
      },
    });
  }

  // =========================================================
  // BACK
  // =========================================================

  backToEmployees(): void {
    this.router.navigate(['/employees']);
  }
}
