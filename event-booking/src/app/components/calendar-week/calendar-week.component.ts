import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { TimeSlot, Category } from '../../models/models';
import { TimeslotCardComponent } from '../timeslot-card/timeslot-card.component';
import { startOfWeek, addDays, addWeeks, subWeeks, formatISO } from 'date-fns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-week',
  standalone: true,
  imports: [CommonModule, DatePipe, TimeslotCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './calendar-week.component.html',
  styleUrls: ['./calendar-week.component.scss']
})
export class CalendarWeekComponent implements OnInit {
  displayWeekStart = startOfWeek(new Date(), {weekStartsOn:1});
  days: Date[] = [];
  timeslotsByDay: Record<string, TimeSlot[]> = {};
  cats: Category[] = [];
  selectedCategories: number[] = [];
  categoryFilter: number | null = null;
  currentUserId = 1;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.buildDays();
    this.loadCategories();
    this.loadTimeslots();
  }

  buildDays() {
    this.days = Array.from({length:7}).map((_,i)=> addDays(this.displayWeekStart, i));
  }

  prevWeek() {
    this.displayWeekStart = subWeeks(this.displayWeekStart,1);
    this.buildDays();
    this.loadTimeslots();
  }

  nextWeek() {
    this.displayWeekStart = addWeeks(this.displayWeekStart,1);
    this.buildDays();
    this.loadTimeslots();
  }

  loadCategories() {
    this.api.getCategories().subscribe(c=> this.cats=c);
  }

  onCategoryFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryFilter = value ? +value : null;
    this.loadTimeslots();
  }

  onCategoryFilter(id: number|null) {
    this.categoryFilter = id;
    this.loadTimeslots();
  }

  isoStart() {
    return formatISO(this.displayWeekStart);
  }

  isoEnd() {
    return formatISO(addDays(this.displayWeekStart,7));
  }

  loadTimeslots() {
    const cat = this.categoryFilter || undefined;
    this.api.getTimeslots(this.isoStart(), this.isoEnd(), cat).subscribe((ts: TimeSlot[]) => {
      this.timeslotsByDay = {};
      for(const t of ts){
        const d = new Date(t.start_dt).toDateString();
        if(!this.timeslotsByDay[d]) this.timeslotsByDay[d]=[];
        this.timeslotsByDay[d].push(t);
      }
    });
  }

  signup(ts: TimeSlot) {
    this.api.createBooking(ts.id, this.currentUserId).subscribe({
      next: ()=> this.loadTimeslots(),
      error: (err: any) => alert(err.error?.detail || 'Could not book')
    });
  }

  unsubscribe(bookingId: number) {
    this.api.deleteBooking(bookingId).subscribe(()=> this.loadTimeslots());
  }

  goToPreferences() {
    this.router.navigate(['/preferences']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}

