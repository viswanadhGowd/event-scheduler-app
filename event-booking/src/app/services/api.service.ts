import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, TimeSlot, Booking, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly base = 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories/`);
  }
  getTimeslots(startIso?: string, endIso?: string, categoryId?: number) {
    let params = new HttpParams();
    if (startIso) params = params.set('start_iso', startIso);
    if (endIso) params = params.set('end_iso', endIso);
    if (categoryId) params = params.set('category_id', categoryId.toString());
    return this.http.get<TimeSlot[]>(`${this.base}/timeslots/`, { params });
  }
  createBooking(timeslotId: number, userId: number) {
    return this.http.post<Booking>(`${this.base}/bookings/`, { timeslot_id: timeslotId, user_id: userId });
  }
  deleteBooking(bookingId: number) {
    return this.http.delete(`${this.base}/bookings/${bookingId}`);
  }
  createUser(username: string) {
    return this.http.post<User>(`${this.base}/users/`, { username });
  }
  setUserPreferences(payload: { user_id: number; category_ids: number[] }) {
    return this.http.post(`${this.base}/user-preferences/`, payload);
  }
  getUserPreferences(userId: number): Observable<{ user_id: number; category_ids: number[] }> {
    return this.http.get<{ user_id: number; category_ids: number[] }>(`${this.base}/user-preferences/${userId}`);
  }
  // admin
  createTimeslot(payload: { category_id: number, start_dt: string, end_dt: string }) {
    return this.http.post<TimeSlot>(`${this.base}/timeslots/`, payload);
  }
  deleteTimeslot(id: number) {
    return this.http.delete(`${this.base}/timeslots/${id}`);
  }
  adminListTimeslots() {
    return this.http.get<any>(`${this.base}/admin/timeslots/`);
  }
}
