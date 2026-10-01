import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apply-leave',
  standalone: true,
  imports: [],
  templateUrl: './apply-leave.html',
  styleUrl: './apply-leave.css',
})
export class ApplyLeaveComponent {
  constructor(private router: Router) {}

  applyLeave() {
    alert('Leave application submitted successfully!');
    this.router.navigate(['/leave-management']);
  }

  cancel() {
    this.router.navigate(['/leave-management']);
  }
}
