import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/models';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  username = '';
  email = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // login fields
  loginUsername = '';
  loginLoading = false;
  loginError = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  signup() {
    if (!this.username.trim()) {
      this.errorMessage = 'Username is required';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.api.createUser(this.username, this.email || undefined).subscribe({
      next: (user: User) => {
        this.successMessage = `User ${user.username} created successfully!`;
        this.isLoading = false;
        
        // Store the user via AuthService
        this.auth.setUser(user);
        
        setTimeout(() => {
          this.router.navigate(['/preferences']);
        }, 1500);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Error creating user. Please try again.';
      }
    });
  }

  // inline login on signup page
  login() {
    if (!this.loginUsername.trim()) {
      this.loginError = 'Username is required';
      return;
    }
    this.loginLoading = true;
    this.loginError = '';

    this.api.login(this.loginUsername).subscribe({
      next: (user: User) => {
        this.auth.setUser(user);
        this.loginLoading = false;
        this.router.navigate(['/preferences']);
      },
      error: (err: any) => {
        this.loginLoading = false;
        this.loginError = err.error?.detail || 'Login failed';
      }
    });
  }

  goToPreferences() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/preferences']);
    } else {
      this.errorMessage = 'Please sign up first';
    }
  }
}
