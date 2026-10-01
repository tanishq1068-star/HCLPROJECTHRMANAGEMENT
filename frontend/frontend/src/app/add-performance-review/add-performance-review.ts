import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-performance-review',
  standalone: true,
  imports: [],
  templateUrl: './add-performance-review.html',
  styleUrl: './add-performance-review.css',
})
export class AddPerformanceReviewComponent {
  constructor(private router: Router) {}

  saveReview() {
    alert('Performance review added successfully!');
    this.router.navigate(['/performance']);
  }

  cancel() {
    this.router.navigate(['/performance']);
  }
}
