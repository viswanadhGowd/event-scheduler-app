import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category, TimeSlot } from '../../models/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  form!: FormGroup;
  categories: Category[] = [];
  timeslots: any[] = [];

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit() {
    this.initForm();
    this.loadCategories();
    this.loadTimeslots();
  }

  initForm() {
    this.form = this.fb.group({
      category_id: ['', Validators.required],
      start_dt: ['', Validators.required],
      end_dt: ['', Validators.required]
    });
  }

  loadCategories() {
    this.api.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  loadTimeslots() {
    this.api.adminListTimeslots().subscribe(slots => {
      this.timeslots = slots;
    });
  }

  addTimeslot() {
    if (this.form.invalid) return;
    
    const { category_id, start_dt, end_dt } = this.form.value;
    const payload = {
      category_id,
      start_dt: new Date(start_dt).toISOString(),
      end_dt: new Date(end_dt).toISOString()
    };

    this.api.createTimeslot(payload).subscribe({
      next: () => {
        this.form.reset();
        this.loadTimeslots();
      },
      error: err => alert('Error adding timeslot: ' + (err.error?.detail || 'Unknown error'))
    });
  }

  deleteTimeslot(id: number) {
    if (confirm('Delete this timeslot?')) {
      this.api.deleteTimeslot(id).subscribe({
        next: () => this.loadTimeslots(),
        error: err => alert('Error: ' + (err.error?.detail || 'Unknown error'))
      });
    }
  }

  getCategoryName(categoryId: number): string {
    const cat = this.categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Unknown';
  }
}
