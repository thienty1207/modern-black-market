-- Seed initial products for SQLite database
-- Use INSERT OR IGNORE based on the product slug to avoid duplicates

-- Test inserting a single product without OR IGNORE

-- Product for Camera category
INSERT OR IGNORE INTO products (id, name, slug, description, price, stock_quantity, is_active, is_featured, category_id, created_at, updated_at)
VALUES 
    (
        lower(hex(randomblob(16))), 
        'Sony Alpha A7 IV', 
        'sony-a7iv', 
        'Full-frame mirrorless camera with excellent autofocus and video capabilities.', 
        2499.99, 
        15, 
        1, -- is_active
        1, -- is_featured
        (SELECT id FROM categories WHERE slug = 'camera'),
        datetime('now'), datetime('now')
    ),
    (
        lower(hex(randomblob(16))), 
        'Canon EOS R6 Mark II', 
        'canon-r6-mkii', 
        'High-performance mirrorless camera, great for stills and video.', 
        2299.00,
        10,
        1, -- is_active
        0, -- is_featured
        (SELECT id FROM categories WHERE slug = 'camera'),
        datetime('now'), datetime('now')
    );

-- Products for Smartphone category
INSERT OR IGNORE INTO products (id, name, slug, description, price, stock_quantity, is_active, is_featured, category_id, created_at, updated_at)
VALUES
    (
        lower(hex(randomblob(16))),
        'iPhone 15 Pro',
        'iphone-15-pro',
        'The latest Pro model from Apple with A17 Bionic chip and advanced camera system.',
        1099.00,
        50,
        1, -- is_active
        1, -- is_featured
        (SELECT id FROM categories WHERE slug = 'smartphone'),
        datetime('now'), datetime('now')
    ),
    (
        lower(hex(randomblob(16))),
        'Samsung Galaxy S24 Ultra',
        'galaxy-s24-ultra',
        'Flagship Android phone with powerful processor, S Pen, and top-tier cameras.',
        1199.99,
        45,
        1, -- is_active
        1, -- is_featured
        (SELECT id FROM categories WHERE slug = 'smartphone'),
        datetime('now'), datetime('now')
    );

-- Products for Laptop category
INSERT OR IGNORE INTO products (id, name, slug, description, price, stock_quantity, is_active, is_featured, category_id, created_at, updated_at)
VALUES
    (
        lower(hex(randomblob(16))),
        'MacBook Pro 14 M3',
        'macbook-pro-14-m3',
        'Apple Silicon powered laptop with incredible performance and battery life.',
        1999.00,
        25,
        1, -- is_active
        0, -- is_featured
        (SELECT id FROM categories WHERE slug = 'laptop'),
        datetime('now'), datetime('now')
    ),
    (
        lower(hex(randomblob(16))),
        'Dell XPS 15',
        'dell-xps-15',
        'Premium Windows laptop with a stunning display and powerful internals.',
        1749.50,
        30,
        1, -- is_active
        0, -- is_featured
        (SELECT id FROM categories WHERE slug = 'laptop'),
        datetime('now'), datetime('now')
    );

-- To run this script:
-- 1. Make sure you have run the seed_categories.sql script first.
-- 2. Use a tool like DB Browser for SQLite or the sqlite3 command-line tool:
--    (In PowerShell, from server dir: Get-Content sql/seed_products.sql | sqlite3 thientyshop.db) 