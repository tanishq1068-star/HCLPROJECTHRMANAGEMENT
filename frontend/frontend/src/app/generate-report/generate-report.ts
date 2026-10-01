import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generate-report',
  standalone: true,
  imports: [],
  templateUrl: './generate-report.html',
  styleUrl: './generate-report.css',
})
export class GenerateReportComponent {
  constructor(private router: Router) {}

  generateReport() {
    alert('Report generated successfully!');
    this.router.navigate(['/reports']);
  }

  cancel() {
    this.router.navigate(['/reports']);
  }
}
