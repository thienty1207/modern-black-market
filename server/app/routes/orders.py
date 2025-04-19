from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_orders():
    """
    Placeholder route for orders.
    Will be implemented in the future.
    """
    return {"message": "Orders API - Not implemented yet"} 