from pydantic import BaseModel, ConfigDict
from typing import Optional
import datetime

class UserPreferenceCreate(BaseModel):
    user_id: int
    category_ids: list[int]

class UserPreferenceOut(BaseModel):
    user_id: int
    category_ids: list[int]


class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None

class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    username: str
    email: Optional[str]
    is_admin: bool

class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    name: str

class TimeSlotCreate(BaseModel):
    category_id: int
    start_dt: datetime.datetime
    end_dt: datetime.datetime

class TimeSlotOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    category_id: int
    start_dt: datetime.datetime
    end_dt: datetime.datetime
    booking_user_id: Optional[int] = None

class BookingCreate(BaseModel):
    timeslot_id: int
    user_id: int

class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    timeslot_id: int
    user_id: int
    created_at: datetime.datetime
