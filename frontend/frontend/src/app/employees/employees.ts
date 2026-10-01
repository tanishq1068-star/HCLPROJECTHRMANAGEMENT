import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Employee, EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];

  filteredEmployees: Employee[] = [];

  searchTerm = '';

  loading = false;

  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  // =========================================================
  // LOAD EMPLOYEES
  // =========================================================

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    console.log('Loading employees...');

    this.employeeService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        console.log('Employees loaded:', employees);

        this.employees = employees || [];

        this.filteredEmployees = [...this.employees];

        this.loading = false;
      },

      error: (error: any) => {
        console.error('Unable to load employees:', error);

        this.employees = [];
        this.filteredEmployees = [];

        this.loading = false;

        this.errorMessage = 'Unable to load employees. Please try again.';
      },
    });
  }

  // =========================================================
  // SEARCH
  // =========================================================

  searchEmployees(): void {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      this.filteredEmployees = [...this.employees];

      return;
    }

    this.filteredEmployees = this.employees.filter(
      (employee) =>
        (employee.id || '').toLowerCase().includes(search) ||
        (employee.name || '').toLowerCase().includes(search) ||
        (employee.email || '').toLowerCase().includes(search) ||
        (employee.department || '').toLowerCase().includes(search) ||
        (employee.position || '').toLowerCase().includes(search),
    );
  }

  // =========================================================
  // ADD EMPLOYEE
  // =========================================================

  addEmployee(): void {
    this.router.navigate(['/add-employee']);
  }

  // =========================================================
  // VIEW EMPLOYEE
  // =========================================================

  viewEmployee(employee: Employee): void {
    console.log('Opening employee:', employee);

    this.router.navigate(['/employee-details', employee.id], {
      state: {
        employee: employee,
      },
    });
  }

  // =========================================================
  // EDIT EMPLOYEE
  // =========================================================

  editEmployee(id: string): void {
    this.router.navigate(['/add-employee'], {
      queryParams: {
        edit: id,
      },
    });
  }

  // =========================================================
  // DELETE EMPLOYEE
  // =========================================================

  deleteEmployee(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this employee?');

    if (!confirmed) {
      return;
    }

    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        alert('Employee deleted successfully.');

        this.loadEmployees();
      },

      error: (error: any) => {
        console.error('Delete failed:', error);

        alert('Unable to delete employee.');
      },
    });
  }

  // =========================================================
  // RETRY
  // =========================================================

  retry(): void {
    this.loadEmployees();
  }
}
