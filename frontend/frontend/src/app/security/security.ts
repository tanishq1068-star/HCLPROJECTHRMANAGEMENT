import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './security.html',
  styleUrl: './security.css',
})
export class SecurityComponent {
  twoFactorEnabled = false;
  securityAlertsEnabled = true;

  enableTwoFactor(): void {
    this.twoFactorEnabled = true;
  }

  viewSessions(): void {
    alert('Login Sessions page is not connected yet.');
  }

  viewActivity(): void {
    alert('Login Activity page is not connected yet.');
  }

  manageEmail(): void {
    alert('Email Security settings are not connected yet.');
  }

  configureAlerts(): void {
    this.securityAlertsEnabled = !this.securityAlertsEnabled;
  }
}
