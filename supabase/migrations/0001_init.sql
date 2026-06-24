-- Goon: Initial schema
-- Run this against your Supabase project via the SQL editor or `supabase db push`

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  image text,
  email_verified timestamptz,
  onboarded boolean DEFAULT false,
  use_case text,
  home_printer text,
  preferred_material text,
  token_version int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- NextAuth adapter tables
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  provider_account_id text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at int,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  UNIQUE(provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token text UNIQUE NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier text NOT NULL,
  token text UNIQUE NOT NULL,
  expires timestamptz NOT NULL,
  UNIQUE(identifier, token)
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  sha256 text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number text UNIQUE NOT NULL,
  file_id uuid REFERENCES files(id),
  file_name text NOT NULL,
  file_size_bytes bigint DEFAULT 0,
  tech text NOT NULL DEFAULT 'fdm',
  material text NOT NULL,
  color text NOT NULL DEFAULT '#6DB5D2',
  quantity int NOT NULL DEFAULT 1,
  shipping_zip text NOT NULL DEFAULT '',
  ai_repair boolean NOT NULL DEFAULT true,
  repaired boolean NOT NULL DEFAULT false,
  repaired_issues text[],
  price_cents int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'queued',
  status_updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Order events (audit log)
CREATE TABLE IF NOT EXISTS order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status text,
  to_status text NOT NULL,
  at timestamptz DEFAULT now()
);
