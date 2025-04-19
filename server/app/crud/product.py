from typing import List, Optional, Dict, Any, Tuple
from uuid import UUID
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.product import Product, ProductImage
from fastapi import HTTPException
import math

# PRODUCT OPERATIONS
async def get_product(session: AsyncSession, product_id: UUID) -> Optional[Product]:
    """
    Get a product by ID.
    """
    query = select(Product).where(Product.id == product_id).options(selectinload(Product.images))
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_product_by_slug(session: AsyncSession, slug: str) -> Optional[Product]:
    """
    Get a product by slug.
    """
    query = select(Product).where(Product.slug == slug).options(selectinload(Product.images))
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_products(
    session: AsyncSession, 
    skip: int = 0, 
    limit: int = 100,
    category_id: Optional[UUID] = None,
    search: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    is_active: Optional[bool] = True
) -> Tuple[List[Product], int]:
    """
    Get multiple products with pagination and filtering.
    Returns a tuple of (products, total_count)
    """
    # Base query with relationship loading
    query = select(Product).options(selectinload(Product.images))
    count_query = select(func.count(Product.id))
    
    # Apply filters
    if category_id is not None:
        query = query.where(Product.category_id == category_id)
        count_query = count_query.where(Product.category_id == category_id)
        
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            (Product.name.ilike(search_pattern)) | 
            (Product.description.ilike(search_pattern))
        )
        count_query = count_query.where(
            (Product.name.ilike(search_pattern)) | 
            (Product.description.ilike(search_pattern))
        )
    
    if price_min is not None:
        query = query.where(Product.price >= price_min)
        count_query = count_query.where(Product.price >= price_min)
        
    if price_max is not None:
        query = query.where(Product.price <= price_max)
        count_query = count_query.where(Product.price <= price_max)
    
    if is_active is not None:
        query = query.where(Product.is_active == is_active)
        count_query = count_query.where(Product.is_active == is_active)
    
    # Get total count for pagination
    total_result = await session.execute(count_query)
    total = total_result.scalar_one()
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await session.execute(query)
    products = result.scalars().all()
    
    return products, total

async def create_product(
    session: AsyncSession, 
    product_data: Dict[str, Any]
) -> Product:
    """
    Create a new product.
    """
    # Check if slug already exists
    existing_product = await get_product_by_slug(session, product_data["slug"])
    if existing_product:
        raise HTTPException(status_code=400, detail="Product with this slug already exists")
    
    # Create product
    product = Product(**product_data)
    session.add(product)
    await session.commit()
    await session.refresh(product)
    
    return product

async def update_product(
    session: AsyncSession, 
    product_id: UUID, 
    product_data: Dict[str, Any]
) -> Optional[Product]:
    """
    Update a product.
    """
    product = await get_product(session, product_id)
    if not product:
        return None
    
    # Check if slug already exists if it's being updated
    if "slug" in product_data and product_data["slug"] != product.slug:
        existing_product = await get_product_by_slug(session, product_data["slug"])
        if existing_product:
            raise HTTPException(status_code=400, detail="Product with this slug already exists")
    
    # Update product fields
    for field, value in product_data.items():
        setattr(product, field, value)
    
    await session.commit()
    await session.refresh(product)
    
    return product

async def delete_product(session: AsyncSession, product_id: UUID) -> bool:
    """
    Delete a product.
    """
    product = await get_product(session, product_id)
    if not product:
        return False
    
    await session.delete(product)
    await session.commit()
    
    return True

# PRODUCT IMAGE OPERATIONS
async def get_product_image(session: AsyncSession, image_id: UUID) -> Optional[ProductImage]:
    """
    Get a product image by ID.
    """
    query = select(ProductImage).where(ProductImage.id == image_id)
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_product_images(session: AsyncSession, product_id: UUID) -> List[ProductImage]:
    """
    Get all images for a product.
    """
    query = select(ProductImage).where(ProductImage.product_id == product_id).order_by(ProductImage.display_order)
    result = await session.execute(query)
    return result.scalars().all()

async def create_product_image(session: AsyncSession, image_data: Dict[str, Any]) -> ProductImage:
    """
    Create a new product image.
    """
    # Check if this is the first image for the product
    existing_images = await get_product_images(session, image_data["product_id"])
    if not existing_images and "is_primary" not in image_data:
        image_data["is_primary"] = True
    
    # Create image
    image = ProductImage(**image_data)
    session.add(image)
    
    # If this image is primary, make sure other images are not primary
    if image.is_primary:
        query = select(ProductImage).where(
            (ProductImage.product_id == image.product_id) & 
            (ProductImage.id != image.id)
        )
        result = await session.execute(query)
        other_images = result.scalars().all()
        
        for other_image in other_images:
            other_image.is_primary = False
    
    await session.commit()
    await session.refresh(image)
    
    return image

async def update_product_image(
    session: AsyncSession, 
    image_id: UUID, 
    image_data: Dict[str, Any]
) -> Optional[ProductImage]:
    """
    Update a product image.
    """
    image = await get_product_image(session, image_id)
    if not image:
        return None
    
    # Update image fields
    for field, value in image_data.items():
        setattr(image, field, value)
    
    # If this image is being set as primary, make sure other images are not primary
    if image_data.get("is_primary"):
        query = select(ProductImage).where(
            (ProductImage.product_id == image.product_id) & 
            (ProductImage.id != image_id)
        )
        result = await session.execute(query)
        other_images = result.scalars().all()
        
        for other_image in other_images:
            other_image.is_primary = False
    
    await session.commit()
    await session.refresh(image)
    
    return image

async def delete_product_image(session: AsyncSession, image_id: UUID) -> bool:
    """
    Delete a product image.
    """
    image = await get_product_image(session, image_id)
    if not image:
        return False
    
    product_id = image.product_id
    is_primary = image.is_primary
    
    await session.delete(image)
    await session.commit()
    
    # If the deleted image was primary, set another image as primary
    if is_primary:
        query = select(ProductImage).where(ProductImage.product_id == product_id).limit(1)
        result = await session.execute(query)
        new_primary = result.scalar_one_or_none()
        
        if new_primary:
            new_primary.is_primary = True
            await session.commit()
    
    return True 