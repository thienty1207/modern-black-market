import uuid
from typing import Optional, List, TYPE_CHECKING
from decimal import Decimal
from sqlalchemy import DECIMAL, Column
from sqlmodel import Field, SQLModel, Relationship
from app.models.base import UUIDModel, TimestampModel


if TYPE_CHECKING:
    from app.models.user import User
    from app.models.category import Category
    from app.models.cart import CartItem
    from app.models.wishlist import WishlistItem
    from app.models.order import OrderItem  
    from app.models.review import Review

class Product(UUIDModel, TimestampModel, table=True):
    """Product model."""
    
    __tablename__ = "products"
    
    name: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    description: str
    price: Decimal = Field(default=0, sa_column=Column(DECIMAL(10, 2)))
    sale_price: Optional[Decimal] = Field(default=None, sa_column=Column(DECIMAL(10, 2)))
    stock_quantity: int = Field(default=0)
    category_id: uuid.UUID = Field(foreign_key="categories.id", index=True)
    is_active: bool = Field(default=True)
    
    # Relationships
    category: "Category" = Relationship(back_populates="products")
    images: List["ProductImage"] = Relationship(back_populates="product")
    cart_items: List["CartItem"] = Relationship(back_populates="product")
    wishlist_items: List["WishlistItem"] = Relationship(back_populates="product")
    order_items: List["OrderItem"] = Relationship(back_populates="product")
    reviews: List["Review"] = Relationship(back_populates="product")


class ProductImage(UUIDModel, table=True):
    """Product image model. Multiple images per product."""
    
    __tablename__ = "product_images"
    
    product_id: uuid.UUID = Field(foreign_key="products.id", index=True)
    image_url: str
    alt_text: Optional[str] = None
    is_primary: bool = Field(default=False)
    display_order: int = Field(default=0)
    
    # Relationship to product
    product: "Product" = Relationship(back_populates="images") 