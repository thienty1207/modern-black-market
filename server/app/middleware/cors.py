from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

def setup_cors_middleware(app: FastAPI) -> None:
    """
    Configure CORS middleware for the application.
    """
    origins = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
    
    # If no origins are configured, allow all origins in development mode
    if not origins and os.getenv("DEBUG", "False").lower() == "true":
        origins = ["*"]
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    ) 