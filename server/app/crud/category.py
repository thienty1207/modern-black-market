from typing import List, Optional, Dict, Any, Tuple
from uuid import UUID
from sqlmodel import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.category import Category
from fastapi import HTTPException

async def get_category(session: AsyncSession, category_id: UUID) -> Optional[Category]:
    """
    Get a category by ID.
    """
    query = select(Category).where(Category.id == category_id)
    query = query.options(selectinload(Category.subcategories))
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_category_by_slug(session: AsyncSession, slug: str) -> Optional[Category]:
    """
    Get a category by slug.
    """
    query = select(Category).where(Category.slug == slug)
    query = query.options(selectinload(Category.subcategories))
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_categories(
    session: AsyncSession, 
    skip: int = 0, 
    limit: int = 100,
    parent_id: Optional[UUID] = None,
    is_active: Optional[bool] = None
) -> Tuple[List[Category], int]:
    """
    Get multiple categories with pagination.
    Returns a tuple of (categories, total_count)
    """
    query = select(Category)
    count_query = select(func.count(Category.id))
    
    # Apply filters
    if parent_id is not None:
        query = query.where(Category.parent_id == parent_id)
        count_query = count_query.where(Category.parent_id == parent_id)
    
    if is_active is not None:
        query = query.where(Category.is_active == is_active)
        count_query = count_query.where(Category.is_active == is_active)
    
    # Get total count for pagination
    total_result = await session.execute(count_query)
    total = total_result.scalar_one()
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await session.execute(query)
    categories = result.scalars().all()
    
    return categories, total

async def get_category_tree(session: AsyncSession, parent_id: Optional[UUID] = None, is_active: Optional[bool] = None) -> List[Category]:
    """
    Get categories as a hierarchical tree.
    If parent_id is None, returns root categories.
    """
    query = select(Category).where(Category.parent_id == parent_id)
    
    if is_active is not None:
        query = query.where(Category.is_active == is_active)
    
    # Include subcategories
    query = query.options(selectinload(Category.subcategories))
    
    result = await session.execute(query)
    categories = result.scalars().all()
    
    return categories

async def create_category(
    session: AsyncSession, 
    category_data: Dict[str, Any]
) -> Category:
    """
    Create a new category.
    """
    # Check if slug already exists
    existing_category = await get_category_by_slug(session, category_data["slug"])
    if existing_category:
        raise HTTPException(status_code=400, detail="Category with this slug already exists")
    
    # Check if parent category exists if specified
    if category_data.get("parent_id"):
        parent = await get_category(session, category_data["parent_id"])
        if not parent:
            raise HTTPException(status_code=400, detail="Parent category not found")
    
    # Create category
    category = Category(**category_data)
    session.add(category)
    await session.commit()
    await session.refresh(category)
    
    return category

async def update_category(
    session: AsyncSession, 
    category_id: UUID, 
    category_data: Dict[str, Any]
) -> Optional[Category]:
    """
    Update a category.
    """
    category = await get_category(session, category_id)
    if not category:
        return None
    
    # Check if slug already exists if it's being updated
    if "slug" in category_data and category_data["slug"] != category.slug:
        existing_category = await get_category_by_slug(session, category_data["slug"])
        if existing_category:
            raise HTTPException(status_code=400, detail="Category with this slug already exists")
    
    # Check if parent category exists if it's being updated
    if "parent_id" in category_data and category_data["parent_id"] != category.parent_id:
        # Verify the parent exists
        if category_data["parent_id"] is not None:
            parent = await get_category(session, category_data["parent_id"])
            if not parent:
                raise HTTPException(status_code=400, detail="Parent category not found")
        
        # Prevent circular references
        if category_data["parent_id"] == category_id:
            raise HTTPException(status_code=400, detail="Category cannot be its own parent")
    
    # Update category fields
    for field, value in category_data.items():
        setattr(category, field, value)
    
    await session.commit()
    await session.refresh(category)
    
    return category

async def delete_category(session: AsyncSession, category_id: UUID) -> bool:
    """
    Delete a category.
    """
    category = await get_category(session, category_id)
    if not category:
        return False
    
    # Check if category has subcategories
    if category.subcategories:
        raise HTTPException(
            status_code=400, 
            detail="Cannot delete category with subcategories. Delete or reassign subcategories first."
        )
    
    # Check if category has associated products
    # This would require a query to check if any products use this category
    # For simplicity, this check is not implemented here
    
    await session.delete(category)
    await session.commit()
    
    return True 