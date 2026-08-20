-- Phase 2 foundation: accounts, saved/versioned AI Builder websites, publishing, leads,
-- AI usage logging. Idempotent — safe to re-run. Matches existing table conventions
-- (serial id, character varying for short strings, text for long, timestamptz created_at).

CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  email character varying NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS magic_links (
  id serial PRIMARY KEY,
  email character varying NOT NULL,
  token_hash character varying NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS magic_links_token_hash_idx ON magic_links (token_hash);

CREATE TABLE IF NOT EXISTS websites (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug character varying UNIQUE,
  business_name character varying NOT NULL,
  status character varying NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  site_data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS websites_user_id_idx ON websites (user_id);
CREATE INDEX IF NOT EXISTS websites_slug_idx ON websites (slug);

CREATE TABLE IF NOT EXISTS website_versions (
  id serial PRIMARY KEY,
  website_id integer NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  site_data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS website_versions_website_id_idx ON website_versions (website_id);

-- Named website_leads (not leads) to stay distinct from the existing chat_leads table
-- (chatbot lead capture, unrelated to the AI Builder).
CREATE TABLE IF NOT EXISTS website_leads (
  id serial PRIMARY KEY,
  website_id integer NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  name character varying NOT NULL,
  email character varying,
  phone character varying,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS website_leads_website_id_idx ON website_leads (website_id);

CREATE TABLE IF NOT EXISTS ai_usage_log (
  id serial PRIMARY KEY,
  feature character varying NOT NULL,
  success boolean NOT NULL,
  error_kind character varying,
  latency_ms integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ai_usage_log_feature_created_at_idx ON ai_usage_log (feature, created_at);
