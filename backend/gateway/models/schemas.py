from pydantic import BaseModel
from typing import Optional

class SignupSchema(BaseModel):
    fullname: str
    phone: str
    email: str
    password: str

class SigninSchema(BaseModel):
    username: str
    password: str

class UsersSchema(BaseModel):
    fullname: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[int] = None
    status: Optional[int] = None

class ResourceSchema(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None
    amenities: Optional[str] = None
    status: Optional[int] = 1

class BookingSchema(BaseModel):
    resourceId: str
    resourceName: Optional[str] = None
    slotDate: str
    startTime: str
    endTime: str
    purpose: Optional[str] = None
    status: Optional[int] = 0
    userId: Optional[int] = None
    createdBy: Optional[int] = None
