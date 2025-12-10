# Event Booking Application - Backend API

FastAPI-based backend server for the Event Booking application. This service manages users, event categories, time slots, bookings, and user preferences.

## Features

- **User Management**: Create and manage user accounts
- **Event Categories**: Pre-defined event categories (Cat 1, Cat 2, Cat 3)
- **Time Slot Management**: Admin can create time slots for event categories
- **Booking System**: Users can sign up for and unsubscribe from time slots
- **One-User-Per-Slot**: Time slot booking constraint enforcement
- **User Preferences**: Users can select their interested event categories
- **Admin Dashboard**: View all time slots and booking status

## Technology Stack

- **Framework**: FastAPI
- **Database**: SQLite (configurable via DATABASE_URL)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Server**: Uvicorn

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

## Configuration

### Database

By default, the application uses SQLite (`test.db`). To use a different database, set the `DATABASE_URL` environment variable:

```bash
# PostgreSQL example
set DATABASE_URL=postgresql://user:password@localhost/dbname

# MySQL example
set DATABASE_URL=mysql://user:password@localhost/dbname
```

### CORS Configuration

CORS is enabled for all origins by default. Modify the `CORSMiddleware` configuration in `main.py` for production:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Running the Server

### Development Mode

```bash
uvicorn app:app  --port 8000
```

The server will start at `http://localhost:8000`.

### Production Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### User Management

#### Create User
```
POST /users/
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com"
}

Response: 201 Created
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_admin": false
}
```

### Categories

#### List Categories
```
GET /categories/

Response: 200 OK
[
  { "id": 1, "name": "Cat 1" },
  { "id": 2, "name": "Cat 2" },
  { "id": 3, "name": "Cat 3" }
]
```

### Time Slots

#### Create Time Slot (Admin)
```
POST /timeslots/
Content-Type: application/json

{
  "category_id": 1,
  "start_dt": "2025-12-20T10:00:00",
  "end_dt": "2025-12-20T11:00:00"
}

Response: 201 Created
{
  "id": 1,
  "category_id": 1,
  "start_dt": "2025-12-20T10:00:00",
  "end_dt": "2025-12-20T11:00:00",
  "booking_user_id": null
}
```

#### List Time Slots
```
GET /timeslots/?start_iso=2025-12-17T00:00:00&end_iso=2025-12-24T00:00:00&category_id=1

Query Parameters:
- start_iso (optional): ISO format start date
- end_iso (optional): ISO format end date
- category_id (optional): Filter by category ID

Response: 200 OK
[
  {
    "id": 1,
    "category_id": 1,
    "start_dt": "2025-12-20T10:00:00",
    "end_dt": "2025-12-20T11:00:00",
    "booking_user_id": null
  }
]
```

#### Delete Time Slot (Admin)
```
DELETE /timeslots/{timeslot_id}

Response: 204 No Content
```

### Bookings

#### Book a Time Slot
```
POST /bookings/
Content-Type: application/json

{
  "timeslot_id": 1,
  "user_id": 1
}

Response: 201 Created
{
  "id": 1,
  "timeslot_id": 1,
  "user_id": 1,
  "created_at": "2025-12-10T12:00:00"
}

Error (409 Conflict): Slot already booked
```

#### Cancel Booking
```
DELETE /bookings/{booking_id}

Response: 204 No Content
```

### User Preferences

#### Set User Preferences
```
POST /user-preferences/
Content-Type: application/json

{
  "user_id": 1,
  "category_ids": [1, 2]
}

Response: 200 OK
{
  "user_id": 1,
  "category_ids": [1, 2]
}
```

#### Get User Preferences
```
GET /user-preferences/{user_id}

Response: 200 OK
{
  "user_id": 1,
  "category_ids": [1, 2]
}
```

### Admin

#### List All Time Slots (with Booking Info)
```
GET /admin/timeslots/

Response: 200 OK
[
  {
    "id": 1,
    "start_dt": "2025-12-20T10:00:00",
    "end_dt": "2025-12-20T11:00:00",
    "category_id": 1,
    "booked": false,
    "booked_by": null
  },
  {
    "id": 2,
    "start_dt": "2025-12-20T11:00:00",
    "end_dt": "2025-12-20T12:00:00",
    "category_id": 1,
    "booked": true,
    "booked_by": 1
  }
]
```

## Database Schema

### Users Table
- `id` (PK, Integer)
- `username` (String, Unique, Required)
- `email` (String, Optional)
- `is_admin` (Boolean, Default: False)

### Categories Table
- `id` (PK, Integer)
- `name` (String, Unique, Required)

### Time Slots Table
- `id` (PK, Integer)
- `category_id` (FK, Integer, Required)
- `start_dt` (DateTime, Required)
- `end_dt` (DateTime, Required)
- `created_by_admin` (FK, Integer, Optional)

### Bookings Table
- `id` (PK, Integer)
- `timeslot_id` (FK, Integer, Required, Unique)
- `user_id` (FK, Integer, Required)
- `created_at` (DateTime, Default: Current UTC Time)

### User Preferences Table
- `id` (PK, Integer)
- `user_id` (FK, Integer, Required)
- `category_id` (FK, Integer, Required)

## Error Handling

The API returns standard HTTP status codes:

- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success with no response body
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `409 Conflict` - Time slot already booked
- `500 Internal Server Error` - Server error

## Seed Data

On startup, the application automatically creates the three default event categories:
- Cat 1
- Cat 2
- Cat 3

## Development Notes

- The database is automatically created and initialized on first run
- Use environment variable `DATABASE_URL` to switch databases
- CORS is open to all origins for development; restrict in production

## Testing

To test the API, you can use:
- **cURL**: Command-line HTTP client
- **Postman**: GUI API testing tool
- **Thunder Client**: VS Code extension
- **httpie**: User-friendly cURL alternative

Example with cURL:
```bash
curl -X POST http://localhost:8000/users/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com"}'
```

## Troubleshooting

### Database Locked Error
- Ensure only one instance of the server is running
- Delete `test.db` to reset the database

### CORS Errors
- Check that the frontend is making requests to `http://localhost:8000`
- Verify CORS middleware configuration

### Port Already in Use
```bash
# Change the port
uvicorn main:app --port 8001
```

## License

MIT License

---

For frontend documentation, see the `event-booking` directory README.
- POST /bookings/ { "timeslot_id": 1, "user_id": 1 }  -> 409 if already booked
- DELETE /bookings/{booking_id}
- GET /admin/timeslots/
