export interface Category { id: number; name: string; }
export interface TimeSlot {
  id: number;
  category_id: number;
  start_dt: string; // ISO
  end_dt: string;
  booking_user_id?: number | null;
}
export interface User { id: number; username: string; email?: string; is_admin: boolean; }
export interface Booking { id: number; timeslot_id: number; user_id: number; created_at: string; }
