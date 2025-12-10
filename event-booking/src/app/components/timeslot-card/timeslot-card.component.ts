import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TimeSlot } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timeslot-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './timeslot-card.component.html',
  styleUrls: ['./timeslot-card.component.scss']
})
export class TimeslotCardComponent implements OnInit, OnDestroy {
  @Input() ts!: TimeSlot;
  @Output() signup = new EventEmitter<TimeSlot>();
  @Output() unsubscribe = new EventEmitter<number>();
  currentUserId: number | null = null;
  private subscription: Subscription | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.currentUserId = this.auth.getUserId();
    // Subscribe to user changes to update UI reactively
    this.subscription = this.auth.currentUser$.subscribe(() => {
      this.currentUserId = this.auth.getUserId();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  
  onSignup() {
    this.signup.emit(this.ts);
  }

  onUnsub() {
    this.unsubscribe.emit(this.ts.id);
  }

  isBooked() {
    return !!this.ts.booking_user_id;
  }

  isMyBooking() {
    return this.ts.booking_user_id === this.currentUserId;
  }
}
