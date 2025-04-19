from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_carts():
    """
    Placeholder route for carts.
    Will be implemented in the future.
    """
    return {"message": "Carts API - Not implemented yet"} 