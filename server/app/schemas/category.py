from typing import Optional, List
from pydantic import BaseModel, validator
from uuid import UUID
from datetime import datetime

# Category Schemas
class CategoryBase(BaseModel):
    """Base schema for category."""
    name: str
    slug: str
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    image_url: Optional[str] = None
    is_active: bool = True

class CategoryCreate(CategoryBase):
    """Schema for creating a category."""
    pass

class CategoryUpdate(BaseModel):
    """Schema for updating a category."""
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    parent_id: Optional[UUID] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class CategoryInDBBase(CategoryBase):
    """Base schema for category in database."""
    id: UUID

    class Config:
        from_attributes = True

class CategorySimple(CategoryInDBBase):
    """Simple category schema without recursive relationships."""
    pass

class Category(CategoryInDBBase):
    """Complete category schema with subcategories."""
    subcategories: List["CategorySimple"] = []
    parent: Optional[CategorySimple] = None

# List response schema
class CategoryList(BaseModel):
    """Schema for list of categories response."""
    items: List[CategorySimple]
    total: int
    page: int
    size: int
    pages: int

# Tree response schema
class CategoryTreeItem(BaseModel):
    """Schema for category tree item."""
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool
    children: List["CategoryTreeItem"] = []

    class Config:
        from_attributes = True

class CategoryTree(BaseModel):
    """Schema for category tree response."""
    items: List[CategoryTreeItem] 