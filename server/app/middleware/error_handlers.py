from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from pydantic import ValidationError
import logging

# Set up logger
logger = logging.getLogger(__name__)

def setup_error_handlers(app: FastAPI) -> None:
    """Configure global error handlers for the application."""
    
    @app.exception_handler(SQLAlchemyError)
    async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
        logger.error(f"Database error: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "A database error occurred. Please try again later."}
        )
    
    @app.exception_handler(ValidationError)
    async def validation_exception_handler(request: Request, exc: ValidationError):
        errors = exc.errors()
        logger.warning(f"Validation error: {errors}")
        return JSONResponse(
            status_code=422,
            content={"detail": "Validation error", "errors": errors}
        )
        
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """
        Handle all other exceptions that aren't caught by more specific handlers.
        """
        logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "An unexpected error occurred. Please try again later."}
        )
 