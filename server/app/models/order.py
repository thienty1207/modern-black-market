import uuid
import enum
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from decimal import Decimal
from sqlalchemy import DECIMAL, Column
from sqlmodel import Field, SQLModel, Relationship
from app.models.base import UUIDModel, TimestampModel


if TYPE_CHECKING:
    from app.models.user import User
    from app.models.address import Address
    from app.models.product import Product

class OrderStatus(str, enum.Enum):
    """Order status enumeration."""
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class Order(UUIDModel, TimestampModel, table=True):
    """Order model."""
    
    __tablename__ = "orders"
    
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    status: OrderStatus = Field(default=OrderStatus.PENDING)
    total_amount: Decimal = Field(default=0, sa_column=Column(DECIMAL(10, 2)))
    shipping_address_id: uuid.UUID = Field(foreign_key="addresses.id")
    tracking_number: Optional[str] = None
    
    # Relationships
    user: "User" = Relationship(back_populates="orders")
    shipping_address: "Address" = Relationship(back_populates="orders")
    items: List["OrderItem"] = Relationship(back_populates="order")


class OrderItem(UUIDModel, table=True):
    """Order item model."""
    
    __tablename__ = "order_items"
    
    order_id: uuid.UUID = Field(foreign_key="orders.id", index=True)
    product_id: uuid.UUID = Field(foreign_key="products.id", index=True)
    quantity: int = Field(default=1)
    price_at_purchase: Decimal = Field(default=0, sa_column=Column(DECIMAL(10, 2)))
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    
    # Relationships
    order: "Order" = Relationship(back_populates="items")
    product: "Product" = Relationship(back_populates="order_items") 