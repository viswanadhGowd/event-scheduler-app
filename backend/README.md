
# Event Booking Backend API

A brief description of what this project does and who it's for

Event Booking Backend API

A FastAPI-based backend service for managing users, event categories, time slots, bookings, and user preferences in an event-booking application.

## Features

1. User creation & management

2. Predefined event categories (Cat 1, Cat 2, Cat 3)

3. Admin-managed time slots

4. Booking & unbooking (one user per slot)

5. User category preferences

6. Admin dashboard API for viewing all slots with booking info


## Prerequisites

- Python 3.9+
- pip (Python package manager)

## Installation

### 1. Navigate to the Backend Directory

```bash
cd backend
```

### 2. Create a Virtual Environment (Recommended)

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## Running the Server

### Development Mode

```bash
uvicorn app:app  --port 8000
```

The server will start at `http://localhost:8000`.

### Database

By default, the application uses SQLite (`test.db`)

## License

MIT License

---

For frontend documentation, see the `event-booking` directory README.
