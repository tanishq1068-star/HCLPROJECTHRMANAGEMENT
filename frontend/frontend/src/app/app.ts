import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  /* =====================================================
     MOBILE MENU
     ===================================================== */

  mobileMenuOpen = false;

  /* =====================================================
     HEADER DROPDOWNS
     ===================================================== */

  notificationsOpen = false;

  profileMenuOpen = false;

  notificationsRead = false;

  constructor(private router: Router) {}

  /* =====================================================
     MOBILE MENU
     ===================================================== */

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    if (this.mobileMenuOpen) {
      this.closeDropdowns();
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  navigateFromMenu(): void {
    this.closeMobileMenu();
    this.closeDropdowns();
  }

  /* =====================================================
     NOTIFICATIONS
     ===================================================== */

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;

    if (this.notificationsOpen) {
      this.profileMenuOpen = false;
    }
  }

  markNotificationsRead(): void {
    this.notificationsRead = true;
  }

  /* =====================================================
     ADMIN PROFILE
     ===================================================== */

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;

    if (this.profileMenuOpen) {
      this.notificationsOpen = false;
    }
  }

  /* =====================================================
     PROFILE NAVIGATION
     ===================================================== */

  openSettings(): void {
    this.profileMenuOpen = false;

    this.router.navigate(['/settings']);
  }

  changePassword(): void {
    this.profileMenuOpen = false;

    this.router.navigate(['/change-password']);
  }

  /* =====================================================
     LOGOUT
     ===================================================== */

  logout(): void {
    this.closeDropdowns();

    this.closeMobileMenu();

    this.router.navigate(['/login']);
  }

  /* =====================================================
     CLOSE DROPDOWNS
     WHEN CLICKING OUTSIDE
     ===================================================== */

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.notification-wrapper') && !target.closest('.profile-wrapper')) {
      this.closeDropdowns();
    }
  }

  /* =====================================================
     CLOSE DROPDOWNS
     ===================================================== */

  closeDropdowns(): void {
    this.notificationsOpen = false;

    this.profileMenuOpen = false;
  }

  /* =====================================================
     ESCAPE KEY
     ===================================================== */

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeDropdowns();

    this.closeMobileMenu();
  }
}
