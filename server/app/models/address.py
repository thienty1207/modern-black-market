import uuid
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from app.models.base import UUIDModel, TimestampModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.order import Order

class Address(UUIDModel, TimestampModel, table=True):
    """User shipping address model."""
    
    __tablename__ = "addresses"
    
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str
    is_default: bool = Field(default=False)
    
    # Relationships
    user: "User" = Relationship(back_populates="addresses")
    orders: List["Order"] = Relationship(back_populates="shipping_address")