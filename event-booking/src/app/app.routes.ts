import { Routes } from '@angular/router';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { CalendarWeekComponent } from './components/calendar-week/calendar-week.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
	{ path: '', component: CalendarWeekComponent },
	{ path: 'preferences', component: PreferencesComponent },
	{ path: 'admin', component: AdminComponent },
];
