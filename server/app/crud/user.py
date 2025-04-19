from typing import Optional, Dict, Any, List
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from uuid import UUID

async def get_user(session: AsyncSession, user_id: UUID) -> Optional[User]:
    """
    Get a user by ID.
    """
    query = select(User).where(User.id == user_id)
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_user_by_email(session: AsyncSession, email: str) -> Optional[User]:
    """
    Get a user by email.
    """
    query = select(User).where(User.email == email)
    result = await session.execute(query)
    return result.scalar_one_or_none()

async def get_users(session: AsyncSession, skip: int = 0, limit: int = 100) -> List[User]:
    """
    Get multiple users with pagination.
    """
    query = select(User).offset(skip).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()

async def create_user(session: AsyncSession, user_data: Dict[str, Any]) -> User:
    """
    Create a new user.
    """
    user = User(**user_data)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

async def update_user(session: AsyncSession, user_id: UUID, user_data: Dict[str, Any]) -> Optional[User]:
    """
    Update a user.
    """
    user = await get_user(session, user_id)
    if not user:
        return None
    
    for field, value in user_data.items():
        setattr(user, field, value)
    
    await session.commit()
    await session.refresh(user)
    return user

async def delete_user(session: AsyncSession, user_id: UUID) -> bool:
    """
    Delete a user.
    """
    user = await get_user(session, user_id)
    if not user:
        return False
    
    await session.delete(user)
    await session.commit()
    return True 