import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ChangePasswordService } from '../services/change-password.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private changePasswordService: ChangePasswordService,
    private router: Router,
  ) {}

  get passwordLengthValid(): boolean {
    return this.newPassword.length >= 6;
  }

  get hasLowercase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  get hasSpecialCharacter(): boolean {
    return /[^A-Za-z0-9]/.test(this.newPassword);
  }

  get passwordsMatch(): boolean {
    return this.newPassword !== '' && this.newPassword === this.confirmPassword;
  }

  get passwordStrength(): string {
    if (!this.newPassword) {
      return '';
    }

    let strength = 0;

    if (this.hasLowercase) {
      strength++;
    }

    if (this.hasUppercase) {
      strength++;
    }

    if (this.hasNumber) {
      strength++;
    }

    if (this.hasSpecialCharacter) {
      strength++;
    }

    if (this.newPassword.length >= 10) {
      strength++;
    }

    if (strength <= 2) {
      return 'Weak';
    }

    if (strength === 3) {
      return 'Medium';
    }

    return 'Strong';
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  changePassword(): void {
    if (!this.currentPassword) {
      alert('Please enter your current password.');
      return;
    }

    if (!this.newPassword) {
      alert('Please enter a new password.');
      return;
    }

    if (!this.passwordLengthValid) {
      alert('New password must contain at least 6 characters.');
      return;
    }

    if (!this.passwordsMatch) {
      alert('New password and confirm password do not match.');
      return;
    }

    if (this.newPassword === this.currentPassword) {
      alert('New password must be different from your current password.');
      return;
    }

    const changed = this.changePasswordService.changePassword(
      this.currentPassword,
      this.newPassword,
    );

    if (!changed) {
      alert('Current password is incorrect.');
      return;
    }

    alert('Password changed successfully!');

    this.clearForm();

    this.router.navigate(['/dashboard']);
  }

  clearForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';

    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  cancel(): void {
    this.clearForm();

    this.router.navigate(['/settings']);
  }
}
