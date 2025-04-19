import uuid
from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from app.models.base import UUIDModel, TimestampModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product

class Wishlist(UUIDModel, TimestampModel, table=True):
    """Wishlist model."""
    
    __tablename__ = "wishlists"
    
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    name: Optional[str] = None
    
    # Relationships
    user: "User" = Relationship(back_populates="wishlists")
    items: List["WishlistItem"] = Relationship(back_populates="wishlist")


class WishlistItem(UUIDModel, table=True):
    """Wishlist item model."""
    
    __tablename__ = "wishlist_items"
    
    wishlist_id: uuid.UUID = Field(foreign_key="wishlists.id", index=True)
    product_id: uuid.UUID = Field(foreign_key="products.id", index=True)
    added_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    wishlist: "Wishlist" = Relationship(back_populates="items")
    product: "Product" = Relationship(back_populates="wishlist_items") 