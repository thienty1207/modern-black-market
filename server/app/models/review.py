import uuid
from typing import Optional, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from app.models.base import UUIDModel, TimestampModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product

    
class Review(UUIDModel, TimestampModel, table=True):
    """Product review model."""
    
    __tablename__ = "reviews"
    
    product_id: uuid.UUID = Field(foreign_key="products.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    rating: int = Field(ge=1, le=5)  # Rating between 1 and 5
    comment: Optional[str] = None
    
    # Relationships
    product: "Product" = Relationship(back_populates="reviews")
    user: "User" = Relationship(back_populates="reviews") 