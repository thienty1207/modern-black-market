from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Query, Path
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
import math

from app.database import get_async_session
from app.crud import product as product_crud
from app.schemas.product import (
    Product, ProductCreate, ProductUpdate, ProductList,
    ProductImage, ProductImageCreate, ProductImageUpdate
)
from app.middleware.authentication import verify_jwt_token

router = APIRouter()

# Product routes
@router.get("/", response_model=ProductList)
async def get_products(
    skip: int = Query(0, ge=0, description="Skip records"),
    limit: int = Query(10, ge=1, le=100, description="Limit records"),
    category_id: Optional[UUID] = Query(None, description="Filter by category ID"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    price_min: Optional[float] = Query(None, ge=0, description="Minimum price"),
    price_max: Optional[float] = Query(None, ge=0, description="Maximum price"),
    is_active: Optional[bool] = Query(True, description="Filter by active status"),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get a list of products with pagination and filtering options.
    """
    products, total = await product_crud.get_products(
        session, 
        skip=skip, 
        limit=limit, 
        category_id=category_id,
        search=search,
        price_min=price_min,
        price_max=price_max,
        is_active=is_active
    )
    
    pages = math.ceil(total / limit) if limit else 1
    
    return {
        "items": products,
        "total": total,
        "page": skip // limit + 1 if limit else 1,
        "size": limit,
        "pages": pages
    }

@router.get("/{product_id}", response_model=Product)
async def get_product(
    product_id: UUID = Path(..., description="The ID of the product to get"),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get a specific product by ID.
    """
    product = await product_crud.get_product(session, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

@router.get("/slug/{slug}", response_model=Product)
async def get_product_by_slug(
    slug: str = Path(..., description="The slug of the product to get"),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get a specific product by slug.
    """
    product = await product_crud.get_product_by_slug(session, slug=slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Create a new product.
    """
    try:
        product = await product_crud.create_product(session, product_in.model_dump())
        return product
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not create product: {str(e)}"
        )

@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: UUID,
    product_in: ProductUpdate,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Update a product.
    """
    product = await product_crud.get_product(session, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    try:
        updated_product = await product_crud.update_product(
            session, 
            product_id=product_id, 
            product_data=product_in.model_dump(exclude_unset=True)
        )
        return updated_product
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not update product: {str(e)}"
        )

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Delete a product.
    """
    product = await product_crud.get_product(session, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    await product_crud.delete_product(session, product_id=product_id)
    return None

# Product Image routes
@router.get("/{product_id}/images", response_model=List[ProductImage])
async def get_product_images(
    product_id: UUID,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get all images for a product.
    """
    product = await product_crud.get_product(session, product_id=product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    images = await product_crud.get_product_images(session, product_id=product_id)
    return images

@router.post("/images", response_model=ProductImage, status_code=status.HTTP_201_CREATED)
async def create_product_image(
    image_in: ProductImageCreate,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Create a new product image.
    """
    # Verify product exists
    product = await product_crud.get_product(session, product_id=image_in.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    try:
        image = await product_crud.create_product_image(session, image_in.model_dump())
        return image
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not create product image: {str(e)}"
        )

@router.put("/images/{image_id}", response_model=ProductImage)
async def update_product_image(
    image_id: UUID,
    image_in: ProductImageUpdate,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Update a product image.
    """
    image = await product_crud.get_product_image(session, image_id=image_id)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product image not found"
        )
    
    try:
        updated_image = await product_crud.update_product_image(
            session, 
            image_id=image_id, 
            image_data=image_in.model_dump(exclude_unset=True)
        )
        return updated_image
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not update product image: {str(e)}"
        )

@router.delete("/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product_image(
    image_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Delete a product image.
    """
    image = await product_crud.get_product_image(session, image_id=image_id)
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product image not found"
        )
    
    await product_crud.delete_product_image(session, image_id=image_id)
    return None 