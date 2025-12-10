


# Event Booking Application - event- booking (Frontend)

Angular 21+ single-page application for booking event time slots. Users can set their event preferences, browse available time slots across the week, book/unbook slots, and admins can manage event time slots.

## Features

- **User Preferences**: Select interested event categories
- **Weekly Calendar View**: Browse time slots for the current week with day/time navigation
- **Event Category Filter**: Filter calendar view by event category
- **Booking Management**: Sign up for and unsubscribe from available time slots
- **Admin Interface**: Add and manage time slots for event categories
- **Responsive UI**: Works on desktop and mobile devices
- **Real-time Updates**: Calendar updates after each action

## Prerequisites

- Node.js 18.19.0 or higher
- npm 10.0.0 or higher
- Angular CLI 21.0.2 (install globally: `npm install -g @angular/cli@21`)

## Installation

### 1. Navigate to the event-booking (Frontend) Directory

```bash
cd event-booking
```

### 2. Install Dependencies

```bash
npm install
```

## Configuration

### Backend API URL

The frontend connects to the FastAPI backend at `http://localhost:8000` by default. To change this:

Edit `src/app/services/api.service.ts`:

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly base = 'http://localhost:8000';  // Change this URL
  // ...
}
```


## Running the Application

### Development Server

```bash
ng serve
```

Or with auto-open in browser:

```bash
ng serve --open
```

The application will be available at `http://localhost:4200/`.

The application will automatically reload whenever you modify any source files.
