import uuid
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import Field, SQLModel, Relationship
from app.models.base import UUIDModel

if TYPE_CHECKING:
    from app.models.product import Product

class Category(UUIDModel, table=True):
    """Product category model with hierarchical structure."""
    
    __tablename__ = "categories"
    
    name: str = Field(index=True)
    slug: str = Field(unique=True, index=True)
    description: Optional[str] = None
    parent_id: Optional[uuid.UUID] = Field(
        default=None, foreign_key="categories.id", index=True
    )
    image_url: Optional[str] = None
    is_active: bool = Field(default=True)
    
    # Self-referential relationship for parent/child categories
    subcategories: List["Category"] = Relationship(
        sa_relationship_kwargs={
            "primaryjoin": "Category.id==Category.parent_id",
            "remote_side": "Category.parent_id"
        }
    )
    
    # Relationship to products
    products: List["Product"] = Relationship(back_populates="category") 