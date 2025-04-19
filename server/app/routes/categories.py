from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
import math

from app.database import get_async_session
from app.crud import category as category_crud
from app.schemas.category import (
    Category, CategoryCreate, CategoryUpdate, CategoryList,
    CategoryTree, CategoryTreeItem, CategorySimple
)
from app.middleware.authentication import verify_jwt_token

router = APIRouter()

@router.get("/", response_model=CategoryList)
async def get_categories(
    skip: int = Query(0, ge=0, description="Skip records"),
    limit: int = Query(100, ge=1, le=500, description="Limit records"),
    parent_id: Optional[UUID] = Query(None, description="Filter by parent category ID"),
    is_active: Optional[bool] = Query(None, description="Filter by active status"),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get a list of categories with pagination.
    """
    categories, total = await category_crud.get_categories(
        session, 
        skip=skip, 
        limit=limit, 
        parent_id=parent_id,
        is_active=is_active
    )
    
    pages = math.ceil(total / limit) if limit else 1
    
    return {
        "items": categories,
        "total": total,
        "page": skip // limit + 1 if limit else 1,
        "size": limit,
        "pages": pages
    }

@router.get("/tree", response_model=CategoryTree)
async def get_category_tree(
    parent_id: Optional[UUID] = Query(None, description="Parent category ID (None for root categories)"),
    is_active: Optional[bool] = Query(True, description="Filter by active status"),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get categories in a hierarchical tree format.
    """
    categories = await category_crud.get_category_tree(
        session, 
        parent_id=parent_id,
        is_active=is_active
    )
    
    # Convert to tree format
    def convert_to_tree_item(category):
        subcategories = [convert_to_tree_item(subcat) for subcat in category.subcategories 
                         if is_active is None or subcat.is_active == is_active]
        
        return CategoryTreeItem(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            image_url=category.image_url,
            is_active=category.is_active,
            children=subcategories
        )
    
    tree_items = [convert_to_tree_item(category) for category in categories]
    
    return {"items": tree_items}

@router.get("/{category_id}", response_model=Category)
async def get_category(
    category_id: UUID = Path(..., description="The ID of the category to get"),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get a specific category by ID.
    """
    category = await category_crud.get_category(session, category_id=category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category

@router.get("/slug/{slug}", response_model=Category)
async def get_category_by_slug(
    slug: str = Path(..., description="The slug of the category to get"),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get a specific category by slug.
    """
    category = await category_crud.get_category_by_slug(session, slug=slug)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category

@router.post("/", response_model=Category, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_in: CategoryCreate,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Create a new category.
    """
    try:
        category = await category_crud.create_category(session, category_in.model_dump())
        return category
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not create category: {str(e)}"
        )

@router.put("/{category_id}", response_model=Category)
async def update_category(
    category_id: UUID,
    category_in: CategoryUpdate,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Update a category.
    """
    category = await category_crud.get_category(session, category_id=category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    try:
        updated_category = await category_crud.update_category(
            session, 
            category_id=category_id, 
            category_data=category_in.model_dump(exclude_unset=True)
        )
        return updated_category
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not update category: {str(e)}"
        )

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Delete a category.
    """
    category = await category_crud.get_category(session, category_id=category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    
    try:
        await category_crud.delete_category(session, category_id=category_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not delete category: {str(e)}"
        )
    
    return None 