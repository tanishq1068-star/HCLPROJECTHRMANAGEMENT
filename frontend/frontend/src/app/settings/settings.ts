import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  CompanySettings,
  NotificationSettings,
  SettingsService,
} from '../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class SettingsComponent {
  activeSection = 'Company';

  companySettings: CompanySettings;
  notificationSettings: NotificationSettings;

  sections = ['Company', 'Notifications', 'Security'];

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  timezones = [
    'Asia/Kolkata',
    'Asia/Dubai',
    'Asia/Singapore',
    'Europe/London',
    'Europe/Paris',
    'America/New_York',
    'America/Los_Angeles',
  ];

  currencies = ['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)'];

  dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];

  twoFactorEnabled = false;
  securityAlertsEnabled = true;

  constructor(
    private settingsService: SettingsService,
    private router: Router,
  ) {
    this.companySettings = this.settingsService.getCompanySettings();

    this.notificationSettings = this.settingsService.getNotificationSettings();
  }

  selectSection(section: string): void {
    this.activeSection = section;
  }

  isWorkingDay(day: string): boolean {
    return this.companySettings.workingDays.includes(day);
  }

  toggleWorkingDay(day: string): void {
    const index = this.companySettings.workingDays.indexOf(day);

    if (index === -1) {
      this.companySettings.workingDays.push(day);
    } else {
      this.companySettings.workingDays.splice(index, 1);
    }
  }

  saveCompanySettings(): void {
    if (!this.companySettings.companyName.trim()) {
      alert('Company name is required.');
      return;
    }

    if (!this.companySettings.companyEmail.trim()) {
      alert('Company email is required.');
      return;
    }

    if (!this.companySettings.companyPhone.trim()) {
      alert('Company phone is required.');
      return;
    }

    if (!this.companySettings.companyAddress.trim()) {
      alert('Company address is required.');
      return;
    }

    if (this.companySettings.workingDays.length === 0) {
      alert('Please select at least one working day.');
      return;
    }

    if (this.companySettings.workingHoursStart >= this.companySettings.workingHoursEnd) {
      alert('Working hours end time must be later than start time.');
      return;
    }

    this.settingsService.updateCompanySettings(this.companySettings);

    alert('Company settings saved successfully!');
  }

  saveNotificationSettings(): void {
    this.settingsService.updateNotificationSettings(this.notificationSettings);

    alert('Notification settings saved successfully!');
  }

  resetSettings(): void {
    const confirmed = confirm(
      'Are you sure you want to reset all settings to their default values?',
    );

    if (!confirmed) {
      return;
    }

    this.settingsService.resetSettings();

    this.companySettings = this.settingsService.getCompanySettings();

    this.notificationSettings = this.settingsService.getNotificationSettings();

    this.twoFactorEnabled = false;
    this.securityAlertsEnabled = true;

    alert('Settings have been reset successfully.');
  }

  // ============================
  // SECURITY ACTIONS
  // ============================

  changePassword(): void {
    this.router.navigate(['/change-password']);
  }

  enableTwoFactor(): void {
    this.twoFactorEnabled = !this.twoFactorEnabled;

    if (this.twoFactorEnabled) {
      alert('Two-factor authentication enabled.');
    } else {
      alert('Two-factor authentication disabled.');
    }
  }

  viewSessions(): void {
    alert('Login Sessions feature is ready to be connected.');
  }

  viewActivity(): void {
    alert('Login Activity feature is ready to be connected.');
  }

  manageEmailSecurity(): void {
    alert('Email Security settings are ready to be connected.');
  }

  configureSecurityAlerts(): void {
    this.securityAlertsEnabled = !this.securityAlertsEnabled;

    alert(this.securityAlertsEnabled ? 'Security alerts enabled.' : 'Security alerts disabled.');
  }
}
