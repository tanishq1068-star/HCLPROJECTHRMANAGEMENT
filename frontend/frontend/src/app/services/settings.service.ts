import { Injectable } from '@angular/core';

export interface CompanySettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  workingDays: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  leaveNotifications: boolean;
  attendanceNotifications: boolean;
  payrollNotifications: boolean;
  performanceNotifications: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly companyStorageKey = 'hrgenius_company_settings';

  private readonly notificationStorageKey = 'hrgenius_notification_settings';

  private readonly defaultCompanySettings: CompanySettings = {
    companyName: 'HRGenius',
    companyEmail: 'hr@hrgenius.com',
    companyPhone: '+91 98765 43210',
    companyAddress: 'Ghaziabad, Uttar Pradesh, India',
    timezone: 'Asia/Kolkata',
    currency: 'INR (₹)',
    dateFormat: 'DD/MM/YYYY',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
  };

  private readonly defaultNotificationSettings: NotificationSettings = {
    emailNotifications: true,
    leaveNotifications: true,
    attendanceNotifications: true,
    payrollNotifications: true,
    performanceNotifications: true,
  };

  private companySettings: CompanySettings = {
    ...this.defaultCompanySettings,
    workingDays: [...this.defaultCompanySettings.workingDays],
  };

  private notificationSettings: NotificationSettings = {
    ...this.defaultNotificationSettings,
  };

  constructor() {
    this.loadSettings();
  }

  getCompanySettings(): CompanySettings {
    return {
      ...this.companySettings,
      workingDays: [...this.companySettings.workingDays],
    };
  }

  updateCompanySettings(settings: CompanySettings): void {
    this.companySettings = {
      ...settings,
      workingDays: [...settings.workingDays],
    };

    this.saveCompanySettings();
  }

  getNotificationSettings(): NotificationSettings {
    return {
      ...this.notificationSettings,
    };
  }

  updateNotificationSettings(settings: NotificationSettings): void {
    this.notificationSettings = {
      ...settings,
    };

    this.saveNotificationSettings();
  }

  resetSettings(): void {
    this.companySettings = {
      ...this.defaultCompanySettings,
      workingDays: [...this.defaultCompanySettings.workingDays],
    };

    this.notificationSettings = {
      ...this.defaultNotificationSettings,
    };

    this.saveCompanySettings();
    this.saveNotificationSettings();
  }

  private saveCompanySettings(): void {
    localStorage.setItem(this.companyStorageKey, JSON.stringify(this.companySettings));
  }

  private saveNotificationSettings(): void {
    localStorage.setItem(this.notificationStorageKey, JSON.stringify(this.notificationSettings));
  }

  private loadSettings(): void {
    const savedCompanySettings = localStorage.getItem(this.companyStorageKey);

    const savedNotificationSettings = localStorage.getItem(this.notificationStorageKey);

    if (savedCompanySettings) {
      try {
        const parsedCompanySettings = JSON.parse(savedCompanySettings);

        if (parsedCompanySettings && typeof parsedCompanySettings === 'object') {
          this.companySettings = {
            ...this.defaultCompanySettings,
            ...parsedCompanySettings,
            workingDays: Array.isArray(parsedCompanySettings.workingDays)
              ? [...parsedCompanySettings.workingDays]
              : [...this.defaultCompanySettings.workingDays],
          };
        }
      } catch {
        this.companySettings = {
          ...this.defaultCompanySettings,
          workingDays: [...this.defaultCompanySettings.workingDays],
        };
      }
    }

    if (savedNotificationSettings) {
      try {
        const parsedNotificationSettings = JSON.parse(savedNotificationSettings);

        if (parsedNotificationSettings && typeof parsedNotificationSettings === 'object') {
          this.notificationSettings = {
            ...this.defaultNotificationSettings,
            ...parsedNotificationSettings,
          };
        }
      } catch {
        this.notificationSettings = {
          ...this.defaultNotificationSettings,
        };
      }
    }

    if (!savedCompanySettings) {
      this.saveCompanySettings();
    }

    if (!savedNotificationSettings) {
      this.saveNotificationSettings();
    }
  }
}
