import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-process-payroll',
  standalone: true,
  imports: [],
  templateUrl: './process-payroll.html',
  styleUrl: './process-payroll.css',
})
export class ProcessPayrollComponent {
  constructor(private router: Router) {}

  processPayroll() {
    alert('Payroll processed successfully!');
    this.router.navigate(['/payroll']);
  }

  cancel() {
    this.router.navigate(['/payroll']);
  }
}
