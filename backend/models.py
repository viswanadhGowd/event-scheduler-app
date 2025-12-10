from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)
    bookings = relationship("Booking", back_populates="user")
    preferences = relationship("UserPreference", back_populates="user", cascade="all, delete-orphan")

class UserPreference(Base):
    __tablename__ = "user_preferences"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    user = relationship("User", back_populates="preferences")
    category = relationship("Category")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    timeslots = relationship("TimeSlot", back_populates="category")

class TimeSlot(Base):
    __tablename__ = "timeslots"
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    start_dt = Column(DateTime, nullable=False)
    end_dt = Column(DateTime, nullable=False)
    created_by_admin = Column(Integer, ForeignKey("users.id"), nullable=True)

    category = relationship("Category", back_populates="timeslots")
    booking = relationship("Booking", back_populates="timeslot", uselist=False)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True)
    timeslot_id = Column(Integer, ForeignKey("timeslots.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    timeslot = relationship("TimeSlot", back_populates="booking")
    user = relationship("User", back_populates="bookings")

    __table_args__ = (UniqueConstraint('timeslot_id', name='uq_booking_timeslot'),)
