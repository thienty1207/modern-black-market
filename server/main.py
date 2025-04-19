import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from dotenv import load_dotenv
import logging

# Import middleware
from app.middleware import setup_cors_middleware, setup_error_handlers

# Import routes
from app.routes import users, products, categories, carts, wishlists, orders, reviews

# Import database
from app.database import create_db_and_tables

# Load environment variables
load_dotenv()

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flag để đảm bảo chỉ tạo DB một lần
_is_db_initialized = False

# Define lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global _is_db_initialized
    logger.info("Starting up API...")
    
    if os.getenv("DEBUG", "False").lower() == "true" and not _is_db_initialized:
        logger.info("Initializing database tables...")
        try:
            await create_db_and_tables()
            _is_db_initialized = True
            logger.info("Database tables initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing database: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down API...")


# Create FastAPI app
app = FastAPI(
    title="Modern Black Market API",
    description="API for Modern Black Market e-commerce platform",
    version="0.1.0",
    lifespan=lifespan
)

# Set up middleware
setup_cors_middleware(app)
setup_error_handlers(app)

# Include routers
app.include_router(users, prefix="/api/users", tags=["Users"])
app.include_router(products, prefix="/api/products", tags=["Products"])
app.include_router(categories, prefix="/api/categories", tags=["Categories"])
app.include_router(carts, prefix="/api/carts", tags=["Carts"])
app.include_router(wishlists, prefix="/api/wishlists", tags=["Wishlists"])
app.include_router(orders, prefix="/api/orders", tags=["Orders"])
app.include_router(reviews, prefix="/api/reviews", tags=["Reviews"])

# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to Modern Black Market API"} 