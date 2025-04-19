from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from app.models.base import UUIDModel, TimestampModel
from app.schemas.user import UserRole
    

if TYPE_CHECKING:
    from app.models.address import Address
    from app.models.cart import Cart
    from app.models.wishlist import Wishlist
    from app.models.order import Order
    from app.models.review import Review

class User(UUIDModel, TimestampModel, table=True):
    """User model, integrated with Clerk authentication."""
    
    __tablename__ = "users"
    
    # Clerk integration fields
    email: str = Field(index=True, unique=True)
    first_name: str
    last_name: str
    # Không lưu URL hình ảnh, sử dụng trực tiếp từ Clerk
    phone_number: Optional[str] = None
    role: UserRole = Field(default=UserRole.USER)
    
    # Relationships
    addresses: List["Address"] = Relationship(back_populates="user")
    carts: List["Cart"] = Relationship(back_populates="user")
    wishlists: List["Wishlist"] = Relationship(back_populates="user")
    orders: List["Order"] = Relationship(back_populates="user")
    reviews: List["Review"] = Relationship(back_populates="user")