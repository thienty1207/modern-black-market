from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.database import get_async_session
from app.crud import user as user_crud
from app.schemas.user import User, UserCreate, UserUpdate, UserSync
from app.middleware.authentication import verify_jwt_token

router = APIRouter()

@router.get("/", response_model=List[User])
async def read_users(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Retrieve users.
    """
    users = await user_crud.get_users(session, skip=skip, limit=limit)
    return users

@router.post("/", response_model=User)
async def create_user(
    user_in: UserCreate,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Create new user.
    """
    user = await user_crud.get_user_by_email(session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists."
        )
    return await user_crud.create_user(session, user_in.model_dump())

@router.post("/sync", response_model=User)
async def sync_user(
    user_data: UserSync = Body(...),
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Sync user data from Clerk with backend.
    Creates a new user if one doesn't exist, otherwise updates the existing user.
    """
    # Extract email from token for security
    # This ensures the JWT token owner can only sync their own data
    email = None
    
    # Try direct email field from token
    if "email" in token_data:
        email = token_data.get("email")
    # Try the user_data structure for Clerk
    elif "user_data" in token_data and isinstance(token_data["user_data"], dict):
        user_data = token_data["user_data"]
        if "primary_email_address" in user_data:
            email = user_data["primary_email_address"]
        elif "email_addresses" in user_data and len(user_data["email_addresses"]) > 0:
            if isinstance(user_data["email_addresses"][0], dict):
                email = user_data["email_addresses"][0].get("email_address")
            elif isinstance(user_data["email_addresses"][0], str):
                email = user_data["email_addresses"][0]
    # Try standard claims
    elif "sub" in token_data and "@" in token_data["sub"]:
        email = token_data["sub"]
    elif "preferred_username" in token_data and "@" in token_data["preferred_username"]:
        email = token_data["preferred_username"]
    
    # Fallback to using sub as email if development mode
    import os
    if not email and "sub" in token_data and os.getenv("DEBUG", "False").lower() == "true":
        clerk_id = token_data["sub"]
        email = f"{clerk_id}@clerk.user"
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not determine email from authentication token"
        )
    
    # Check if user already exists
    existing_user = await user_crud.get_user_by_email(session, email=email)
    
    # Prepare user data
    user_sync_data = {
        "email": email,  # Always use email from token
        "first_name": user_data.first_name,
        "last_name": user_data.last_name,
        "profile_image_url": user_data.profile_image_url
    }
    
    if existing_user:
        # Update existing user
        updated_user = await user_crud.update_user(
            session, 
            user_id=existing_user.id,
            user_data=user_sync_data
        )
        return updated_user
    else:
        # Create new user
        new_user = await user_crud.create_user(session, user_sync_data)
        return new_user

@router.get("/me", response_model=User)
async def read_current_user(
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Get current user.
    """
    # Look for email in different places in the token
    email = None
    
    # Print token structure for debug
    print(f"Token data keys: {list(token_data.keys())}")
    
    # Try direct email field
    if "email" in token_data:
        email = token_data.get("email")
        print(f"Found email directly in token: {email}")
    
    # Try Clerk's user_data structure
    elif "user_data" in token_data and isinstance(token_data["user_data"], dict):
        user_data = token_data["user_data"]
        print(f"User data keys: {list(user_data.keys())}")
        
        # Method 1: primary_email_address field
        if "primary_email_address" in user_data:
            email = user_data["primary_email_address"]
            print(f"Found email in user_data.primary_email_address: {email}")
        
        # Method 2: email_addresses array
        elif "email_addresses" in user_data and len(user_data["email_addresses"]) > 0:
            print(f"Email addresses: {user_data['email_addresses']}")
            if isinstance(user_data["email_addresses"][0], dict):
                email = user_data["email_addresses"][0].get("email_address")
                print(f"Found email in user_data.email_addresses[0].email_address: {email}")
            elif isinstance(user_data["email_addresses"][0], str):
                email = user_data["email_addresses"][0]
                print(f"Found email in user_data.email_addresses[0] (string): {email}")
    
    # Try email in standard claims
    elif "sub" in token_data and "@" in token_data["sub"]:
        email = token_data["sub"]
        print(f"Using sub as email: {email}")
    elif "preferred_username" in token_data and "@" in token_data["preferred_username"]:
        email = token_data["preferred_username"]
        print(f"Using preferred_username as email: {email}")
    
    # Last resort: use sub (Clerk user ID) as identifier
    if not email and "sub" in token_data:
        clerk_id = token_data["sub"]
        print(f"No email found, using Clerk ID as fallback: {clerk_id}")
        # For development only: create a fake email from the user ID
        email = f"{clerk_id}@clerk.user"
    
    if not email:
        print("Could not find email in token with keys:", list(token_data.keys()))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not extract email from credentials"
        )
    
    # Find user in database
    user = await user_crud.get_user_by_email(session, email=email)
    
    # If user not found, return 404
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.get("/{user_id}", response_model=User)
async def read_user(
    user_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Get a specific user by id.
    """
    user = await user_crud.get_user(session, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: UUID,
    user_in: UserUpdate,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Update a user.
    """
    user = await user_crud.get_user(session, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if email is being updated and if it's already taken
    if user_in.email and user_in.email != user.email:
        existing_user = await user_crud.get_user_by_email(session, email=user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    user = await user_crud.update_user(session, user_id=user_id, user_data=user_in.model_dump(exclude_unset=True))
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: UUID,
    session: AsyncSession = Depends(get_async_session),
    token_data: dict = Depends(verify_jwt_token)
):
    """
    Delete a user.
    """
    user = await user_crud.get_user(session, user_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    await user_crud.delete_user(session, user_id=user_id)
    return None 