# Modern Black Market - Database Setup Guide

## Overview

This document provides instructions for setting up a database for the Modern Black Market e-commerce application. Based on the client codebase analysis, the application requires a database to store products, users, orders, carts, and other related data.

## Database Requirements

The application is an e-commerce platform with the following features:
- User authentication and profiles
- Product catalog with categories
- Shopping cart
- Order management
- Wishlist functionality

## Recommended Database Solutions

### Option 1: PostgreSQL (Recommended)

PostgreSQL is a powerful open-source relational database that would work well for this application.

#### Why PostgreSQL?
- Strong performance for complex queries
- JSONB support for complex product data like features and specs
- Excellent support for transactions (important for orders)
- Good scalability
- Open-source with strong community support

### Option 2: MongoDB

If you prefer a NoSQL approach, MongoDB would be suitable for this application, especially for storing product data with varying attributes.

#### Why MongoDB?
- Flexible schema is good for product data that may have different attributes
- Good performance for read-heavy operations
- Easy to scale horizontally
- Easier to work with complex nested objects

## Database Schema (SQL-based approach)

Here's the recommended database schema for a PostgreSQL implementation:

### Tables

#### 1. users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_image_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- For external auth providers like Clerk
CREATE TABLE user_auth_providers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'clerk', 'google', etc.
  provider_user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. product_categories
```sql
CREATE TABLE product_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. products
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  original_price DECIMAL(12, 2),
  description TEXT,
  features JSONB, -- Array of feature strings
  specs JSONB, -- Key-value pairs of specifications
  category_id INTEGER REFERENCES product_categories(id),
  featured BOOLEAN DEFAULT false,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. product_images
```sql
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5. carts
```sql
CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. cart_items
```sql
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 7. orders
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  total_amount DECIMAL(12, 2) NOT NULL,
  shipping_address JSONB NOT NULL, -- Includes name, street, city, state, zip, country
  payment_method VARCHAR(100),
  payment_status VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 8. order_items
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  name VARCHAR(255) NOT NULL, -- Snapshot of product name at time of purchase
  price DECIMAL(12, 2) NOT NULL, -- Snapshot of price at time of purchase
  quantity INTEGER NOT NULL,
  image_url TEXT, -- Snapshot of primary image at time of purchase
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 9. wishlists
```sql
CREATE TABLE wishlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 10. wishlist_items
```sql
CREATE TABLE wishlist_items (
  id SERIAL PRIMARY KEY,
  wishlist_id INTEGER REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Indexes

To optimize query performance, add the following indexes:

```sql
-- Product indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_products_description ON products USING gin(to_tsvector('english', description));

-- Order indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Cart indexes
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- Wishlist indexes
CREATE INDEX idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);
```

## Sample Data Initialization

To initialize the database with sample data:

```sql
-- Insert sample categories
INSERT INTO product_categories (name, slug, description) VALUES 
('Phones', 'phones', 'Smartphones and mobile devices'),
('Laptops', 'laptops', 'Laptops and portable computers'),
('Cameras', 'cameras', 'Digital cameras and photography equipment');

-- Insert sample products (example for one product)
INSERT INTO products (name, price, original_price, description, features, specs, category_id, featured) VALUES 
('iPhone 13 Pro', 24475500, 26925500, 'Experience the ultimate iPhone with our most advanced camera system and stunning Super Retina XDR display with ProMotion.',
  '["A15 Bionic chip with 5-core GPU", "Super Retina XDR display with ProMotion", "Pro camera system with new 12MP Telephoto, Wide, and Ultra Wide", "Up to 28 hours of video playback"]'::jsonb,
  '{"display": "6.1-inch Super Retina XDR", "chip": "A15 Bionic", "camera": "Pro 12MP camera system", "battery": "Up to 28 hours", "storage": "128GB, 256GB, 512GB, 1TB"}'::jsonb,
  (SELECT id FROM product_categories WHERE slug = 'phones'),
  true
);

-- Insert product images
INSERT INTO product_images (product_id, image_url, display_order) VALUES 
((SELECT id FROM products WHERE name = 'iPhone 13 Pro'), 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 1),
((SELECT id FROM products WHERE name = 'iPhone 13 Pro'), 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80', 2);
```

## Backend API Implementation

### Recommended Technologies:

1. **Node.js with Express**:
   ```bash
   npm init -y
   npm install express pg cors dotenv bcrypt jsonwebtoken
   ```

2. **Or Spring Boot (Java)**:
   ```bash
   # Use Spring Initializr to create a project with:
   # - Spring Web
   # - Spring Data JPA
   # - PostgreSQL Driver
   # - Spring Security
   ```

3. **Or Django (Python)**:
   ```bash
   pip install django djangorestframework psycopg2-binary
   ```

### Example API Endpoints to Implement:

```
# Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

# Products
GET /api/products
GET /api/products/:id
GET /api/products/category/:category
GET /api/products/featured

# User
GET /api/user/profile
PUT /api/user/profile

# Cart
GET /api/cart
POST /api/cart/add
PUT /api/cart/update
DELETE /api/cart/remove/:id

# Orders
GET /api/orders
GET /api/orders/:id
POST /api/orders

# Wishlist
GET /api/wishlist
POST /api/wishlist/add
DELETE /api/wishlist/remove/:id
```

## Database Connection Setup

Here's a basic example of setting up a connection to PostgreSQL using Node.js:

```javascript
// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
```

Create a `.env` file in your backend project:

```
DB_USER=your_username
DB_HOST=localhost
DB_NAME=modern_black_market
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

## Further Recommendations

1. **Use an ORM (Object-Relational Mapping)**: Consider using Sequelize (Node.js), Hibernate (Java), or Django ORM (Python) to simplify database operations.

2. **Implement Robust Error Handling**: Ensure all database operations have proper error handling.

3. **Add Pagination**: For endpoints that return lists, implement pagination to improve performance.

4. **Database Migration Tool**: Use a migration tool (e.g., Flyway, Liquibase, or Sequelize migrations) to manage database schema changes.

5. **Implement Caching**: For frequently accessed data like products and categories, implement Redis or other caching solutions.

6. **Data Validation**: Use libraries like Joi (Node.js), Hibernate Validator (Java), or Django's form validation to validate data before it's persisted to the database.

7. **Security**: Implement proper security measures like password hashing, JWT for authentication, and prepared statements to prevent SQL injection.

8. **Backup Strategy**: Set up regular database backups.

## Conclusion

This database structure should support all the features of the Modern Black Market e-commerce application. The PostgreSQL implementation provides a solid foundation for building a scalable and robust backend service.

Remember to adapt this structure based on specific business requirements and expected user load.
