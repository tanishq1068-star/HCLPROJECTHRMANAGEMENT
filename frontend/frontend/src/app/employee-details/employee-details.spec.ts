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
    this.loadEmployee();
  }

  // =========================================================
  // LOAD EMPLOYEE
  // =========================================================

  loadEmployee(): void {
    const employeeId = this.route.snapshot.paramMap.get('id');

    console.log('Employee ID from URL:', employeeId);

    if (!employeeId) {
      this.loading = false;

      this.errorMessage = 'Employee ID was not found.';

      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.employee = null;

    console.log('Loading employees to find ID:', employeeId);

    /*
     * IMPORTANT:
     *
     * We use GET /employees instead of
     * GET /employees/{id}.
     *
     * This works even if your backend does not
     * have a separate GET-by-ID endpoint.
     */

    this.employeeService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        console.log('Employees received:', employees);

        const foundEmployee = employees.find(
          (item: Employee) => String(item.id) === String(employeeId),
        );

        if (!foundEmployee) {
          console.error('Employee not found:', employeeId);

          this.employee = null;

          this.errorMessage = `Employee with ID ${employeeId} was not found.`;

          this.loading = false;

          return;
        }

        console.log('Employee found:', foundEmployee);

        this.employee = foundEmployee;

        this.loading = false;
      },

      error: (error: any) => {
        console.error('Failed to load employees:', error);

        this.employee = null;

        this.loading = false;

        if (error.status === 0) {
          this.errorMessage =
            'Cannot connect to backend. Make sure your backend is running on port 8080.';
        } else {
          this.errorMessage = 'Unable to load employee details.';
        }
      },
    });
  }

  // =========================================================
  // EDIT EMPLOYEE
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
  // DELETE EMPLOYEE
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
        console.error('Delete failed:', error);

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
