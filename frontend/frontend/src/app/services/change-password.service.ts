import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordService {
  constructor(private authService: AuthService) {}

  verifyCurrentPassword(currentPassword: string): boolean {
    return this.authService.verifyPassword(currentPassword);
  }

  changePassword(currentPassword: string, newPassword: string): boolean {
    return this.authService.changePassword(currentPassword, newPassword);
  }

  resetPassword(): void {
    this.authService.resetPassword();
  }
}
