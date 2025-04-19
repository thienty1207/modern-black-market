from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_reviews():
    """
    Placeholder route for reviews.
    Will be implemented in the future.
    """
    return {"message": "Reviews API - Not implemented yet"} 