from typing import Optional, List, Union
from pydantic import BaseModel, Field, validator
from decimal import Decimal
from uuid import UUID
from datetime import datetime

# ProductImage Schemas
class ProductImageBase(BaseModel):
    """Base schema for product image."""
    image_url: str
    alt_text: Optional[str] = None
    is_primary: bool = False
    display_order: int = 0

class ProductImageCreate(ProductImageBase):
    """Schema for creating a product image."""
    product_id: UUID

class ProductImageUpdate(BaseModel):
    """Schema for updating a product image."""
    image_url: Optional[str] = None
    alt_text: Optional[str] = None
    is_primary: Optional[bool] = None
    display_order: Optional[int] = None

class ProductImageInDBBase(ProductImageBase):
    """Base schema for product image in database."""
    id: UUID
    product_id: UUID

    class Config:
        from_attributes = True

class ProductImage(ProductImageInDBBase):
    """Schema for product image response."""
    pass

# Product Schemas
class ProductBase(BaseModel):
    """Base schema for product."""
    name: str
    slug: str
    description: str
    price: Decimal
    sale_price: Optional[Decimal] = None
    stock_quantity: int = 0
    category_id: UUID
    is_active: bool = True

    @validator('price', 'sale_price')
    def validate_price(cls, v):
        if v is not None and v < 0:
            raise ValueError('Price must be non-negative')
        return v

    @validator('stock_quantity')
    def validate_stock(cls, v):
        if v < 0:
            raise ValueError('Stock quantity must be non-negative')
        return v

class ProductCreate(ProductBase):
    """Schema for creating a product."""
    pass

class ProductUpdate(BaseModel):
    """Schema for updating a product."""
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    sale_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    category_id: Optional[UUID] = None
    is_active: Optional[bool] = None

class ProductInDBBase(ProductBase):
    """Base schema for product in database."""
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Product(ProductInDBBase):
    """Schema for product response."""
    images: List[ProductImage] = []

# List response schema
class ProductList(BaseModel):
    """Schema for list of products response."""
    items: List[Product]
    total: int
    page: int
    size: int
    pages: int 