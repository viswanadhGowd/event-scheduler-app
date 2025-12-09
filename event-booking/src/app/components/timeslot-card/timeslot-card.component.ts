import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TimeSlot } from '../../models/models';

@Component({
  selector: 'app-timeslot-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './timeslot-card.component.html',
  styleUrls: ['./timeslot-card.component.scss']
})
export class TimeslotCardComponent {
  @Input() ts!: TimeSlot;
  @Output() signup = new EventEmitter<TimeSlot>();
  @Output() unsubscribe = new EventEmitter<number>();
  currentUserId = 1; // demo

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
