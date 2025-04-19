import uuid
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from app.models.base import UUIDModel, TimestampModel

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.product import Product


class Cart(UUIDModel, TimestampModel, table=True):
    """Shopping cart model."""
    
    __tablename__ = "carts"
    
    user_id: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id", index=True)
    session_id: Optional[str] = Field(default=None, index=True)
    
    # Relationships
    user: Optional["User"] = Relationship(back_populates="carts")
    items: List["CartItem"] = Relationship(back_populates="cart")


class CartItem(UUIDModel, TimestampModel, table=True):
    """Shopping cart item model."""
    
    __tablename__ = "cart_items"
    
    cart_id: uuid.UUID = Field(foreign_key="carts.id", index=True)
    product_id: uuid.UUID = Field(foreign_key="products.id", index=True)
    quantity: int = Field(default=1)
    
    # Relationships
    cart: "Cart" = Relationship(back_populates="items")
    product: "Product" = Relationship(back_populates="cart_items") 