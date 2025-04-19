from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    """User role enumeration."""
    ADMIN = "admin"
    USER = "user"

class UserBase(BaseModel):
    """Base user properties."""
    email: EmailStr
    first_name: str
    last_name: str
    profile_image_url: Optional[str] = None
    phone_number: Optional[str] = None

class UserCreate(UserBase):
    """Properties to receive on user creation."""
    pass

class UserSync(BaseModel):
    """Properties to receive for user synchronization from Clerk."""
    first_name: str
    last_name: str
    profile_image_url: Optional[str] = None

class UserUpdate(BaseModel):
    """Properties to receive on user update."""
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    phone_number: Optional[str] = None

class UserInDBBase(UserBase):
    """Base user model stored in DB."""
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    role: UserRole = UserRole.USER

    class Config:
        from_attributes = True

class User(UserInDBBase):
    """Additional properties to return to client."""
    pass

class UserInDB(UserInDBBase):
    """Additional properties stored in DB."""
    pass 