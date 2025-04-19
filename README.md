# Modern Black Market - Backend

This is the backend API for the Modern Black Market e-commerce platform. It is built with FastAPI, SQLModel, and PostgreSQL.

## Database Schema

The database is designed to support an e-commerce application with the following tables:

### Users
- Stores user information, integrated with Clerk authentication
- Primary information stored in Clerk, with additional app-specific data stored here
- Fields:
  - `id` (UUID, PK): Unique identifier, matches Clerk user ID
  - `email` (String): User's email address
  - `first_name` (String): User's first name
  - `last_name` (String): User's last name  
  - `profile_image_url` (String): URL to profile image (from Clerk)
  - `phone_number` (String, Optional): User's phone number
  - `created_at` (DateTime): When the account was created
  - `updated_at` (DateTime): When the account was last updated

### Addresses
- Stores user shipping addresses
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `user_id` (UUID, FK): Reference to Users table
  - `address_line1` (String): Street address
  - `address_line2` (String, Optional): Apartment, suite, etc.
  - `city` (String): City
  - `state` (String): State/province
  - `postal_code` (String): ZIP/postal code
  - `country` (String): Country
  - `is_default` (Boolean): Whether this is the user's default address
  - `created_at` (DateTime): When the address was created
  - `updated_at` (DateTime): When the address was last updated

### Categories
- Product categories
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `name` (String): Category name
  - `slug` (String): URL-friendly name
  - `description` (Text, Optional): Category description
  - `parent_id` (UUID, FK, Optional): Self-reference for hierarchical categories
  - `image_url` (String, Optional): Category image
  - `is_active` (Boolean): Whether category is active

### Products
- Stores product information
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `name` (String): Product name
  - `slug` (String): URL-friendly name
  - `description` (Text): Product description
  - `price` (Decimal): Product price
  - `sale_price` (Decimal, Optional): Discounted price if on sale
  - `stock_quantity` (Integer): Available units
  - `category_id` (UUID, FK): Reference to Categories table
  - `is_active` (Boolean): Whether product is available
  - `created_at` (DateTime): When the product was created
  - `updated_at` (DateTime): When the product was last updated

### ProductImages
- Stores product images (multiple per product)
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `product_id` (UUID, FK): Reference to Products table
  - `image_url` (String): URL to product image
  - `alt_text` (String, Optional): Alternative text for accessibility
  - `is_primary` (Boolean): Whether this is the primary product image
  - `display_order` (Integer): Order to display images

### Carts
- Stores shopping cart information
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `user_id` (UUID, FK, Optional): Reference to Users table (null for guest carts)
  - `session_id` (String, Optional): For guest users
  - `created_at` (DateTime): When the cart was created
  - `updated_at` (DateTime): When the cart was last updated

### CartItems
- Items in a shopping cart
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `cart_id` (UUID, FK): Reference to Carts table
  - `product_id` (UUID, FK): Reference to Products table
  - `quantity` (Integer): Number of items
  - `created_at` (DateTime): When the item was added
  - `updated_at` (DateTime): When the item was last updated

### Wishlists
- Stores wishlist information
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `user_id` (UUID, FK): Reference to Users table
  - `name` (String, Optional): Custom wishlist name
  - `created_at` (DateTime): When the wishlist was created
  - `updated_at` (DateTime): When the wishlist was last updated

### WishlistItems
- Items in a wishlist
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `wishlist_id` (UUID, FK): Reference to Wishlists table
  - `product_id` (UUID, FK): Reference to Products table
  - `added_at` (DateTime): When the item was added

### Orders
- Stores order information
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `user_id` (UUID, FK): Reference to Users table
  - `status` (Enum): Order status (e.g., 'pending', 'paid', 'shipped', 'delivered', 'cancelled')
  - `total_amount` (Decimal): Total order amount
  - `shipping_address_id` (UUID, FK): Reference to Addresses table
  - `tracking_number` (String, Optional): Shipping tracking number
  - `created_at` (DateTime): When the order was created
  - `updated_at` (DateTime): When the order was last updated

### OrderItems
- Items in an order
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `order_id` (UUID, FK): Reference to Orders table
  - `product_id` (UUID, FK): Reference to Products table
  - `quantity` (Integer): Number of items
  - `price_at_purchase` (Decimal): Price when purchased
  - `created_at` (DateTime): When the order item was created

### Reviews
- Product reviews
- Fields:
  - `id` (UUID, PK): Unique identifier
  - `product_id` (UUID, FK): Reference to Products table
  - `user_id` (UUID, FK): Reference to Users table
  - `rating` (Integer): Rating (1-5)
  - `comment` (Text, Optional): Review text
  - `created_at` (DateTime): When the review was created
  - `updated_at` (DateTime): When the review was last updated




### Integration with Clerk

This API integrates with Clerk for authentication and user management. It uses Clerk webhooks to synchronize user data between Clerk and the application database.

When a user signs up or logs in via Clerk in the frontend, the backend API will:
1. Verify the JWT token from Clerk
2. Create or retrieve the user record in the application database
3. Provide authorized access to protected endpoints

### Development Notes

- The API uses SQLModel, which combines SQLAlchemy and Pydantic for a seamless ORM experience
- FastAPI provides automatic OpenAPI documentation
- Alembic is used for database migrations
- PostgreSQL is the primary database
- JWT and Clerk handle authentication



# Structure
ecommerce_project/
├── alembic/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models/
│   ├── schemas/
│   ├── crud/
│   ├── routes/
│   ├── middleware/ 
│   ├── services/
│   └── utils/
│       
├── .env
├── requirements.txt
└── README.md