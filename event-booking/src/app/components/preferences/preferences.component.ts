import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
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
  currentUserId = 1; // TODO: Get from auth
  isLoading = false;
  successMessage = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
    this.loadUserPreferences();
  }

  loadCategories() {
    this.api.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  loadUserPreferences() {
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
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err: any) => {
        this.isLoading = false;
        alert('Error saving preferences: ' + (err.error?.detail || 'Unknown error'));
      }
    });
  }

  goToCalendar() {
    this.router.navigate(['/']);
  }
}
