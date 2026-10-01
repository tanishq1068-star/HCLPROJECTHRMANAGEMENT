import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent {
  userName = 'HR Administrator';
  userRole = 'HR Administrator';
  userInitial = 'H';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.loadUser();
  }

  loadUser(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return;
    }

    this.userName = user.name;
    this.userRole = user.role;
    this.userInitial = user.name.charAt(0).toUpperCase();
  }

  logout(): void {
    const confirmed = confirm('Are you sure you want to logout?');

    if (!confirmed) {
      return;
    }

    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
