from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_wishlists():
    """
    Placeholder route for wishlists.
    Will be implemented in the future.
    """
    return {"message": "Wishlists API - Not implemented yet"} 