"""
Database models for SQLModel.
"""

# Import base models first
from app.models.base import UUIDModel, TimestampModel

# Import all models theo thứ tự đúng 
# Category cần được import trước Product, v.v.
from app.models.user import User
from app.models.address import Address
from app.models.category import Category 
from app.models.product import Product, ProductImage
from app.models.cart import Cart, CartItem
from app.models.wishlist import Wishlist, WishlistItem
from app.models.order import Order, OrderItem
from app.models.review import Review

__all__ = [
    "UUIDModel", "TimestampModel",
    "User", "Address", "Category", "Product", "ProductImage",
    "Cart", "CartItem", "Wishlist", "WishlistItem",
    "Order", "OrderItem", "Review"
] 