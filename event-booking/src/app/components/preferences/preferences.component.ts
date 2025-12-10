import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Category } from '../../models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  categories: Category[] = [];
  selected = new Set<number>();
  currentUserId: number | null = null;
  currentUser: any = null;
  isLoading = false;
  successMessage = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {
    this.currentUser = this.auth.getUser();
    this.currentUserId = this.auth.getUserId();
  }

  ngOnInit() {
    if (!this.currentUserId) {
      // Redirect to signup if no user is logged in
      this.router.navigate(['/signup']);
      return;
    }
    this.loadCategories();
    this.loadUserPreferences();
  }

  loadCategories() {
    this.api.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  loadUserPreferences() {
    if (!this.currentUserId) return;
    
    this.api.getUserPreferences(this.currentUserId).subscribe({
      next: (prefs: any) => {
        this.selected = new Set(prefs.category_ids);
      },
      error: () => {
        // User might not have preferences yet
      }
    });
  }

  toggle(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selected.add(id);
    } else {
      this.selected.delete(id);
    }
  }

  savePreferences() {
    if (!this.currentUserId) {
      alert('User not authenticated');
      return;
    }
    this.isLoading = true;
    const payload = {
      user_id: this.currentUserId,
      category_ids: Array.from(this.selected)
    };

    this.api.setUserPreferences(payload).subscribe({
      next: () => {
        this.successMessage = 'Preferences saved successfully!';
        this.isLoading = false;
        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/calander']);
        }, 2000);
      },
      error: (err: any) => {
        this.isLoading = false;
        alert('Error saving preferences: ' + (err.error?.detail || 'Unknown error'));
      }
    });
  }

  goToCalendar() {
    this.router.navigate(['/calander']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/signup']);
  }
}
