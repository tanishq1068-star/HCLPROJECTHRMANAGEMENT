import { Injectable } from '@angular/core';

export interface AuthUser {
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly loginKey = 'hrgenius_logged_in';

  private readonly userKey = 'hrgenius_user';

  private readonly passwordKey = 'hrgenius_password';

  private readonly defaultEmail = 'admin@hrgenius.com';

  private readonly defaultPassword = 'Admin@123';

  login(email: string, password: string): boolean {
    const storedPassword = localStorage.getItem(this.passwordKey) || this.defaultPassword;

    if (email.trim().toLowerCase() !== this.defaultEmail || password !== storedPassword) {
      return false;
    }

    const user: AuthUser = {
      name: 'HR Administrator',
      email: this.defaultEmail,
      role: 'HR Administrator',
    };

    localStorage.setItem(this.loginKey, 'true');

    localStorage.setItem(this.userKey, JSON.stringify(user));

    if (!localStorage.getItem(this.passwordKey)) {
      localStorage.setItem(this.passwordKey, this.defaultPassword);
    }

    return true;
  }

  logout(): void {
    localStorage.removeItem(this.loginKey);

    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.loginKey) === 'true';
  }

  getCurrentUser(): AuthUser | null {
    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      return null;
    }
  }

  verifyPassword(currentPassword: string): boolean {
    const storedPassword = localStorage.getItem(this.passwordKey) || this.defaultPassword;

    return currentPassword === storedPassword;
  }

  changePassword(currentPassword: string, newPassword: string): boolean {
    if (!this.verifyPassword(currentPassword)) {
      return false;
    }

    if (!newPassword || newPassword.length < 6) {
      return false;
    }

    if (newPassword === currentPassword) {
      return false;
    }

    localStorage.setItem(this.passwordKey, newPassword);

    return true;
  }

  resetPassword(): void {
    localStorage.setItem(this.passwordKey, this.defaultPassword);
  }

  getDefaultEmail(): string {
    return this.defaultEmail;
  }
}
