-- Goon: Row Level Security policies
-- Run after 0001_init.sql

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Accounts: users can only see their own linked accounts
CREATE POLICY "Users can read own accounts" ON accounts
  FOR SELECT USING (auth.uid() = user_id);

-- Sessions: users can only see their own sessions
CREATE POLICY "Users can read own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Files: users can only access their own files
CREATE POLICY "Users can read own files" ON files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files" ON files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files" ON files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files" ON files
  FOR DELETE USING (auth.uid() = user_id);

-- Orders: users can only access their own orders
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order events: users can only see events for their own orders
CREATE POLICY "Users can read own order events" ON order_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_events.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order events" ON order_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_events.order_id AND orders.user_id = auth.uid()
    )
  );
