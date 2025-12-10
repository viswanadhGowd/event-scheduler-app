import { Routes } from '@angular/router';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { CalendarWeekComponent } from './components/calendar-week/calendar-week.component';
import { AdminComponent } from './components/admin/admin.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
	{ path: 'calander', component: CalendarWeekComponent },
	{ path: '', component: SignupComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'preferences', component: PreferencesComponent },
	{ path: 'admin', component: AdminComponent },
];
