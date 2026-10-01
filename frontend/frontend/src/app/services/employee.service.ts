import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map, catchError, of, throwError } from 'rxjs';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joiningDate: string;
  status: 'Active' | 'Inactive';
  salary: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:8080/employees';

  constructor(private http: HttpClient) {}

  // =========================================================
  // NORMALIZE EMPLOYEE
  // =========================================================

  private normalizeEmployee(employee: any): Employee {
    return {
      id: String(employee?.id ?? ''),

      name: String(employee?.name ?? ''),

      email: String(employee?.email ?? ''),

      phone: String(employee?.phone ?? ''),

      department: String(employee?.department ?? ''),

      position: String(employee?.position ?? ''),

      joiningDate: String(employee?.joiningDate ?? ''),

      status: employee?.status === 'Inactive' ? 'Inactive' : 'Active',

      salary: Number(employee?.salary ?? 0),
    };
  }

  // =========================================================
  // GET ALL EMPLOYEES
  // =========================================================

  getEmployees(): Observable<Employee[]> {
    console.log('GET employees:', this.apiUrl);

    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => {
        console.log('Backend GET response:', response);

        let employees: any[] = [];

        // Backend returns:
        // [ {...}, {...} ]

        if (Array.isArray(response)) {
          employees = response;
        }

        // Backend returns:
        // { employees: [...] }
        else if (Array.isArray(response?.employees)) {
          employees = response.employees;
        }

        // Backend returns:
        // { data: [...] }
        else if (Array.isArray(response?.data)) {
          employees = response.data;
        }

        // Backend returns:
        // { content: [...] }
        // Useful if backend uses pagination.
        else if (Array.isArray(response?.content)) {
          employees = response.content;
        }

        console.log('Employees extracted:', employees);

        return employees.map((employee) => this.normalizeEmployee(employee));
      }),

      catchError((error) => {
        console.error('GET employees failed:', error);

        // IMPORTANT:
        // Do not hide the error.
        // The component needs to know
        // that the backend request failed.

        return throwError(() => error);
      }),
    );
  }

  // =========================================================
  // GET EMPLOYEE BY ID
  // =========================================================

  getEmployeeById(id: string): Observable<Employee> {
    console.log('Looking for employee ID:', id);

    /*
     * First try:
     *
     * GET /employees/{id}
     *
     * If the backend supports this endpoint,
     * we get the employee directly.
     */

    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((employee) => {
        console.log('Employee received directly:', employee);

        return this.normalizeEmployee(employee);
      }),

      /*
       * If /employees/{id} does not work,
       * fall back to GET /employees.
       */

      catchError((error) => {
        console.warn(`GET /employees/${id} failed. Trying GET /employees instead.`, error);

        return this.getEmployees().pipe(
          map((employees) => {
            const employee = employees.find((item) => String(item.id) === String(id));

            if (!employee) {
              throw new Error(`Employee with ID ${id} was not found.`);
            }

            console.log('Employee found from employee list:', employee);

            return employee;
          }),
        );
      }),
    );
  }

  // =========================================================
  // ADD EMPLOYEE
  // =========================================================

  addEmployee(employee: Employee): Observable<Employee> {
    /*
     * Do NOT send an empty ID.
     *
     * Your AddEmployeeComponent creates:
     *
     * id: ''
     *
     * If the backend generates IDs,
     * sending id: '' can cause problems.
     */

    const data = {
      name: employee.name,

      email: employee.email,

      phone: employee.phone,

      department: employee.department,

      position: employee.position,

      joiningDate: employee.joiningDate,

      status: employee.status,

      salary: Number(employee.salary ?? 0),
    };

    console.log('POST employee:', data);

    return this.http.post<any>(this.apiUrl, data).pipe(
      map((savedEmployee) => {
        console.log('Employee saved by backend:', savedEmployee);

        return this.normalizeEmployee(savedEmployee);
      }),
    );
  }

  // =========================================================
  // UPDATE EMPLOYEE
  // =========================================================

  updateEmployee(employee: Employee): Observable<Employee> {
    const data = {
      name: employee.name,

      email: employee.email,

      phone: employee.phone,

      department: employee.department,

      position: employee.position,

      joiningDate: employee.joiningDate,

      status: employee.status,

      salary: Number(employee.salary ?? 0),
    };

    console.log('PUT employee:', employee.id, data);

    return this.http.put<any>(`${this.apiUrl}/${employee.id}`, data).pipe(
      map((updatedEmployee) => {
        console.log('Employee updated:', updatedEmployee);

        return this.normalizeEmployee(updatedEmployee);
      }),
    );
  }

  // =========================================================
  // DELETE EMPLOYEE
  // =========================================================

  deleteEmployee(id: string): Observable<void> {
    console.log('DELETE employee:', id);

    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // =========================================================
  // CHECK EMPLOYEE EXISTS
  // =========================================================

  employeeExists(id: string): Observable<boolean> {
    return this.getEmployees().pipe(
      map((employees) => employees.some((employee) => String(employee.id) === String(id))),

      catchError(() => of(false)),
    );
  }

  // =========================================================
  // GET EMPLOYEES BY DEPARTMENT
  // =========================================================

  getEmployeesByDepartment(department: string): Observable<Employee[]> {
    return this.getEmployees().pipe(
      map((employees) => employees.filter((employee) => employee.department === department)),
    );
  }

  // =========================================================
  // GET EMPLOYEES BY STATUS
  // =========================================================

  getEmployeesByStatus(status: 'Active' | 'Inactive'): Observable<Employee[]> {
    return this.getEmployees().pipe(
      map((employees) => employees.filter((employee) => employee.status === status)),
    );
  }
}
