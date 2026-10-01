import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Employee, EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee.html',
  styleUrl: './add-employee.css',
})
export class AddEmployeeComponent {
  employee: Employee = {
    id: '',
    name: '',
    email: '',
    phone: '',
    department: 'IT',
    position: '',
    joiningDate: '',
    status: 'Active',
    salary: 0,
  };

  isEditMode = false;
  saving = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
  ) {
    this.loadEmployeeForEdit();
  }

  // =========================================================
  // LOAD EMPLOYEE FOR EDIT
  // =========================================================

  loadEmployeeForEdit(): void {
    const editId = this.route.snapshot.queryParamMap.get('edit');

    if (!editId) {
      return;
    }

    this.employeeService.getEmployeeById(editId).subscribe({
      next: (employee: Employee) => {
        this.employee = {
          ...employee,
        };

        this.isEditMode = true;
      },

      error: (error: any) => {
        console.error('Failed to load employee:', error);

        alert('Employee not found.');

        this.router.navigate(['/employees']);
      },
    });
  }

  // =========================================================
  // SAVE EMPLOYEE
  // =========================================================

  saveEmployee(): void {
    // Check required fields
    if (
      !this.employee.name.trim() ||
      !this.employee.email.trim() ||
      !this.employee.phone.trim() ||
      !this.employee.department ||
      !this.employee.position.trim() ||
      !this.employee.joiningDate
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    // Convert salary to number
    this.employee.salary = Number(this.employee.salary);

    // Validate salary
    if (!Number.isFinite(this.employee.salary) || this.employee.salary < 0) {
      alert('Please enter a valid salary.');
      return;
    }

    // Update existing employee
    if (this.isEditMode) {
      this.updateEmployee();
    }

    // Create new employee
    else {
      this.createEmployee();
    }
  }

  // =========================================================
  // CREATE EMPLOYEE
  // =========================================================

  private createEmployee(): void {
    const employeeToSave: Employee = {
      id: '',

      name: this.employee.name.trim(),

      email: this.employee.email.trim(),

      phone: this.employee.phone.trim(),

      department: this.employee.department.trim(),

      position: this.employee.position.trim(),

      joiningDate: this.employee.joiningDate,

      status: this.employee.status,

      salary: Number(this.employee.salary),
    };

    console.log('Sending employee to backend:', employeeToSave);

    this.saving = true;

    this.employeeService.addEmployee(employeeToSave).subscribe({
      next: (savedEmployee: Employee) => {
        console.log('Employee added successfully:', savedEmployee);

        this.saving = false;

        alert('Employee added successfully!');

        // Go back to employee list
        this.router.navigate(['/employees']);
      },

      error: (error: any) => {
        this.saving = false;

        console.error('Error adding employee:', error);

        if (error.status === 0) {
          alert('Cannot connect to backend. Make sure your backend is running on port 8080.');
        } else if (error.status === 400) {
          alert('Invalid employee data. Please check the form.');
        } else if (error.status === 409) {
          alert('Employee already exists.');
        } else {
          alert('Unable to add employee.');
        }
      },
    });
  }

  // =========================================================
  // UPDATE EMPLOYEE
  // =========================================================

  private updateEmployee(): void {
    const employeeToUpdate: Employee = {
      ...this.employee,

      id: this.employee.id.trim(),

      name: this.employee.name.trim(),

      email: this.employee.email.trim(),

      phone: this.employee.phone.trim(),

      department: this.employee.department.trim(),

      position: this.employee.position.trim(),

      joiningDate: this.employee.joiningDate,

      status: this.employee.status,

      salary: Number(this.employee.salary),
    };

    console.log('Updating employee:', employeeToUpdate);

    this.saving = true;

    this.employeeService.updateEmployee(employeeToUpdate).subscribe({
      next: (updatedEmployee: Employee) => {
        console.log('Employee updated successfully:', updatedEmployee);

        this.saving = false;

        alert('Employee updated successfully!');

        this.router.navigate(['/employees']);
      },

      error: (error: any) => {
        this.saving = false;

        console.error('Error updating employee:', error);

        if (error.status === 0) {
          alert('Cannot connect to backend. Make sure your backend is running on port 8080.');
        } else if (error.status === 404) {
          alert('Employee not found.');
        } else if (error.status === 400) {
          alert('Invalid employee data.');
        } else {
          alert('Unable to update employee.');
        }
      },
    });
  }

  // =========================================================
  // CANCEL
  // =========================================================

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
