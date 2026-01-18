-- 1. Create ORDERS table (Required for Backend Connection & Reports)
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

-- Indexes for Orders
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- 2. Update RESTAURANTS table (Add missing columns for Profile/Settings)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS gstin TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Insert some dummy ORDER data (Optional: So Reports aren't empty initially)
INSERT INTO orders (order_id, customer_name, items, total, status, created_at)
VALUES 
  ('ORD-TEST-1', 'Amit Sharma', '[{"name": "Masala Vada Pav", "quantity": 2, "price": 40}]'::jsonb, 80.00, 'delivered', NOW() - INTERVAL '2 hours'),
  ('ORD-TEST-2', 'Sneha Gupta', '[{"name": "Cheese Masala Vada Pav", "quantity": 1, "price": 60}]'::jsonb, 60.00, 'preparing', NOW())
ON CONFLICT (order_id) DO NOTHING;
