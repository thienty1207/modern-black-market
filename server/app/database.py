from typing import AsyncGenerator
import os
import logging
from sqlmodel import SQLModel, create_engine, Session, inspect
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logger = logging.getLogger(__name__)

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Create synchronous engine for migrations and setup
sync_engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("DEBUG", "False").lower() == "true"
)

# Create async engine for API operations
async_engine = create_async_engine(
    DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
    echo=os.getenv("DEBUG", "False").lower() == "true",
    future=True
)

# Create async session factory
async_session_factory = async_sessionmaker(
    bind=async_engine,
    expire_on_commit=False,
    class_=AsyncSession
)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to create and get a new database session.
    """
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


def get_sync_session():
    """
    Create and return a synchronous session.
    """
    with Session(sync_engine) as session:
        return session


def table_exists(table_name):
    """
    Check if a table exists in the database.
    """
    inspector = inspect(sync_engine)
    return table_name in inspector.get_table_names()


async def create_db_and_tables():
    """
    Create all tables defined in models.
    Used only during development or initial setup.
    """
    # Import models để đảm bảo SQLModel biết về tất cả các model
    import app.models.user
    import app.models.address
    import app.models.product
    import app.models.category
    import app.models.cart
    import app.models.wishlist
    import app.models.order
    import app.models.review
    
    # Kiểm tra xem bảng users đã tồn tại chưa
    import asyncio
    from concurrent.futures import ThreadPoolExecutor
    
    with ThreadPoolExecutor() as pool:
        # Kiểm tra xem bảng users đã tồn tại chưa
        users_exists = await asyncio.get_event_loop().run_in_executor(
            pool, lambda: table_exists("users")
        )
        
        if users_exists:
            logger.info("Database tables already exist, skipping creation")
            return
            
        # Nếu bảng chưa tồn tại, tạo tất cả các bảng
        logger.info("Creating database tables...")
        await asyncio.get_event_loop().run_in_executor(
            pool, lambda: SQLModel.metadata.create_all(sync_engine)
        )
        logger.info("Database tables created successfully") 