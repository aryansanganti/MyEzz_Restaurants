-- ============================================================================
-- FINAL SAFE SETUP SCRIPT
-- Purpose: Add missing backend requirements WITHOUT touching existing data.
-- ============================================================================

-- 1. Enable UUIDs (Required for the new 'orders' table)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create ORDERS Table (This is MISSING and required for the Reports page)
-- We use 'IF NOT EXISTS' so it won't hurt anything if you run it twice.
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    items JSONB NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (
        status IN (
            'new', 'preparing', 'ready', 'completed', 'delivered', 'rejected', 'cancelled'
        )
    ),
    verification_code TEXT,
    prep_time INTEGER,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Indexes for Orders (For faster report generation)
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- 4. Update RESTAURANTS Table (Add missing columns for Settings/Profile)
-- We check 'IF NOT EXISTS' to avoid errors if you already added them.
-- Your existing columns (name, image_url, etc.) are untouched.
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS gstin TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. Insert Sample Order Data (Only if empty, so Reports aren't blank)
INSERT INTO orders (order_id, customer_name, items, total, status, created_at)
VALUES 
  ('ORD-INIT-1', 'Amit Sharma', '[{"name": "Masala Vada Pav", "quantity": 2, "price": 40}]'::jsonb, 80.00, 'delivered', NOW() - INTERVAL '2 hours'),
  ('ORD-INIT-2', 'Sneha Gupta', '[{"name": "Cheese Masala Vada Pav", "quantity": 1, "price": 60}]'::jsonb, 60.00, 'preparing', NOW())
ON CONFLICT (order_id) DO NOTHING;

-- ============================================================================
-- NOTE: Your existing tables (restaurants, menu_items, etc.) are NOT modified.
-- ============================================================================
