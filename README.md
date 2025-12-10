# Event Scheduler App

A full-stack application for booking events from predefined time slots.



## Overview

The Event Scheduler App is a modern, responsive web application built with:
- **Event-booking (Frontend)**: Angular 21+ with responsive UI
- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: SQLite (configurable)
- **Architecture**: REST API with standalone Angular components

## Features

### User Features
- Select event category preferences

- View weekly calendar

- Filter slots by category

- Book & cancel time slots

- Responsive UI

### Admin Features
-  Add new time slots for event categories
-  See all available and booked time slots
-  Track which user booked each time slot
-  Remove time slots as needed
-  Flexible scheduling with start/end times



## Project Structure

```
event-scheduler-app/
├── backend/          # FastAPI backend
└── event-booking/    # Angular frontend

```


## Quick Start


### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app:app  --port 8000
```

The backend API will be available at `http://localhost:8000`.

### Frontend Setup

```bash
# Navigate to Event-booking (Frontend) directory
cd event-booking

# Install dependencies
npm install

# Start the development server
ng serve --open
```

The Event-booking (Frontend) will open automatically at `http://localhost:4200/`.




## License

MIT License - See individual README files for more details

## Documentation

- **[Backend README](backend/README.md)** - Complete API documentation and setup
- **[Event-booking (Frontend) README](event-booking/README.md)** - UI guide and component documentation
