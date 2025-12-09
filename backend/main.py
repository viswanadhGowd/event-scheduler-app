from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional
import datetime

from models import Base, User, Category, TimeSlot, Booking, UserPreference
from sqlalchemy import delete
import schemas
import database

Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Event Booking API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/user-preferences/", response_model=schemas.UserPreferenceOut)
def set_user_preferences(prefs: schemas.UserPreferenceCreate, db: Session = Depends(get_db)):
    # Remove existing preferences
    db.query(UserPreference).filter(UserPreference.user_id == prefs.user_id).delete()
    # Add new preferences
    for cat_id in prefs.category_ids:
        db.add(UserPreference(user_id=prefs.user_id, category_id=cat_id))
    db.commit()
    return {"user_id": prefs.user_id, "category_ids": prefs.category_ids}

@app.get("/user-preferences/{user_id}", response_model=schemas.UserPreferenceOut)
def get_user_preferences(user_id: int, db: Session = Depends(get_db)):
    prefs = db.query(UserPreference).filter(UserPreference.user_id == user_id).all()
    category_ids = [p.category_id for p in prefs]
    return {"user_id": user_id, "category_ids": category_ids}

@app.on_event("startup")
def seed():
    db = database.SessionLocal()
    try:
        if not db.query(Category).first():
            cats = [Category(name="Cat 1"), Category(name="Cat 2"), Category(name="Cat 3")]
            db.add_all(cats)
            db.commit()
    finally:
        db.close()

@app.post("/users/", response_model=schemas.UserOut)
def create_user(u: schemas.UserCreate, db: Session = Depends(get_db)):
    user = User(username=u.username, email=u.email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.get("/categories/", response_model=list[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@app.post("/timeslots/", response_model=schemas.TimeSlotOut, status_code=status.HTTP_201_CREATED)
def create_timeslot(t: schemas.TimeSlotCreate, db: Session = Depends(get_db)):
    ts = TimeSlot(category_id=t.category_id, start_dt=t.start_dt, end_dt=t.end_dt)
    db.add(ts)
    db.commit()
    db.refresh(ts)
    out = schemas.TimeSlotOut.from_orm(ts)
    out.booking_user_id = None
    return out

@app.get("/timeslots/", response_model=list[schemas.TimeSlotOut])
def list_timeslots(start_iso: Optional[str] = None, end_iso: Optional[str] = None, category_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(TimeSlot)
    if start_iso and end_iso:
        start = datetime.datetime.fromisoformat(start_iso)
        end = datetime.datetime.fromisoformat(end_iso)
        q = q.filter(TimeSlot.start_dt >= start, TimeSlot.start_dt < end)
    if category_id:
        q = q.filter(TimeSlot.category_id == category_id)
    timeslots = q.order_by(TimeSlot.start_dt).all()
    out = []
    for ts in timeslots:
        dto = schemas.TimeSlotOut.from_orm(ts)
        dto.booking_user_id = ts.booking.user_id if ts.booking else None
        out.append(dto)
    return out

@app.post("/bookings/", response_model=schemas.BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(b: schemas.BookingCreate, db: Session = Depends(get_db)):
    timeslot = db.query(TimeSlot).filter(TimeSlot.id == b.timeslot_id).first()
    if not timeslot:
        raise HTTPException(status_code=404, detail="timeslot not found")
    booking = Booking(timeslot_id=b.timeslot_id, user_id=b.user_id)
    db.add(booking)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="timeslot already booked")
    db.refresh(booking)
    return booking

@app.delete("/bookings/{booking_id}", status_code=204)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="booking not found")
    db.delete(booking)
    db.commit()
    return

@app.delete("/timeslots/{timeslot_id}", status_code=204)
def delete_timeslot(timeslot_id: int, db: Session = Depends(get_db)):
    timeslot = db.query(TimeSlot).filter(TimeSlot.id == timeslot_id).first()
    if not timeslot:
        raise HTTPException(status_code=404, detail="timeslot not found")
    db.delete(timeslot)
    db.commit()
    return

@app.get("/admin/timeslots/")
def admin_list_timeslots(db: Session = Depends(get_db)):
    ts = db.query(TimeSlot).order_by(TimeSlot.start_dt).all()
    res = []
    for t in ts:
        res.append({
            "id": t.id,
            "start_dt": t.start_dt,
            "end_dt": t.end_dt,
            "category_id": t.category_id,
            "booked": bool(t.booking),
            "booked_by": t.booking.user_id if t.booking else None
        })
    return res
