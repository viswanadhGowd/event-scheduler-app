import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  isLoading = false;
  errorMessage = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  login() {
    if (!this.username.trim()) {
      this.errorMessage = 'Username is required';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';

    this.api.login(this.username).subscribe({
      next: (user: User) => {
        this.auth.setUser(user);
        this.isLoading = false;
        this.router.navigate(['/preferences']);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = err.error?.detail || 'Login failed';
      }
    });
  }
}
