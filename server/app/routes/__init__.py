"""
API routes/endpoints.
"""

# Import all router modules
from app.routes.users import router as users
from app.routes.products import router as products
from app.routes.categories import router as categories
from app.routes.carts import router as carts
from app.routes.wishlists import router as wishlists
from app.routes.orders import router as orders
from app.routes.reviews import router as reviews

__all__ = ["users", "products", "categories", "carts", "wishlists", "orders", "reviews"] 