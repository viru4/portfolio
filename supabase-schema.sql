-- ═══════════════════════════════════════
-- Supabase SQL — Portfolio Admin Tables
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════

-- 1. Messages table (already created — skip if exists)
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (contact form), only authenticated can SELECT/UPDATE/DELETE
DROP POLICY IF EXISTS "Allow anonymous inserts" ON messages;
CREATE POLICY "Allow anonymous inserts" ON messages
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated full access" ON messages;
CREATE POLICY "Allow authenticated full access" ON messages
  FOR ALL USING (auth.role() = 'authenticated');


-- 2. Projects table
CREATE TABLE IF NOT EXISTS projects (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  github_link TEXT,
  demo_link TEXT,
  ml_pipeline TEXT[] DEFAULT '{}',
  results JSONB DEFAULT '[]',
  icon TEXT DEFAULT 'Code',
  color TEXT DEFAULT 'violet',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read projects" ON projects
  FOR SELECT USING (true);
CREATE POLICY "Auth manage projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');


-- 3. Skills table
CREATE TABLE IF NOT EXISTS skills (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read skills" ON skills
  FOR SELECT USING (true);
CREATE POLICY "Auth manage skills" ON skills
  FOR ALL USING (auth.role() = 'authenticated');


-- 4. Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  description TEXT,
  date TEXT,
  url TEXT,
  color TEXT DEFAULT 'violet',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read certifications" ON certifications
  FOR SELECT USING (true);
CREATE POLICY "Auth manage certifications" ON certifications
  FOR ALL USING (auth.role() = 'authenticated');


-- 5. About table (single-row)
CREATE TABLE IF NOT EXISTS about (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  bio TEXT,
  career_goal TEXT,
  learning_focus TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE about ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read about" ON about
  FOR SELECT USING (true);
CREATE POLICY "Auth manage about" ON about
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed a default row so the admin editor has something to update
INSERT INTO about (bio, career_goal, learning_focus) VALUES (
  'I''m a final-year B.Tech student specializing in AI & Machine Learning.',
  'Seeking an AI/ML Engineer role where I can design, build and deploy scalable ML solutions.',
  'Currently deepening my skills in deep learning, NLP and MLOps.'
);
