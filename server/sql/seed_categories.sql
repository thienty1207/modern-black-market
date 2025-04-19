-- Seed initial categories for SQLite database
-- Use INSERT OR IGNORE to avoid errors if slugs already exist

-- Generate UUIDs manually or use a tool if needed, or let the application handle it if possible.
-- For simplicity here, we assume UUIDs might be handled by the application or manually generated.
-- If your application logic relies on specific UUIDs, generate them here.
-- Example using placeholders (replace with actual UUIDs if needed):

INSERT OR IGNORE INTO categories (id, name, slug, description, is_active)
VALUES 
    -- Replace 'uuid_camera' with a real UUID string if needed
    (lower(hex(randomblob(16))), 'Camera', 'camera', 'High-quality cameras for photography and videography.', 1),
    
    -- Replace 'uuid_smartphone' with a real UUID string if needed
    (lower(hex(randomblob(16))), 'Smartphone', 'smartphone', 'Latest smartphones with advanced features.', 1),
    
    -- Replace 'uuid_laptop' with a real UUID string if needed
    (lower(hex(randomblob(16))), 'Laptop', 'laptop', 'Powerful laptops for work, gaming, and everyday use.', 1);

-- Note on UUIDs in SQLite:
-- SQLite does not have a built-in UUID type or gen_random_uuid() function.
-- UUIDs are typically stored as TEXT or BLOB.
-- The example above uses randomblob(16) to generate 16 random bytes (like a UUID) and hex() to format it as hex text.
-- Ensure your application/models handle UUIDs as TEXT when interacting with SQLite.

-- Note: The created_at and updated_at columns were not created by SQLModel in SQLite.
-- The application logic might need adjustment if it relies on these columns,
-- or the table creation process needs further investigation.

-- To run this script:
-- 1. Ensure the server has run once to create the thientyshop.db file and tables.
-- 2. Use a tool like DB Browser for SQLite or the sqlite3 command-line tool:
--    sqlite3 server/thientyshop.db < server/sql/seed_categories.sql
--    (In PowerShell: Get-Content server/sql/seed_categories.sql | sqlite3 server/thientyshop.db)
--    (If in server dir: Get-Content sql/seed_categories.sql | sqlite3 thientyshop.db) 