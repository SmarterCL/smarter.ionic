-- Supabase Database Schema for SmarterOS Ionic Template
-- This schema includes tables for user profiles, MCP logs, and sessions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  username TEXT,
  email TEXT,
  website TEXT,
  avatar_url TEXT,
  mcp_access BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (id),
  CONSTRAINT email_unique UNIQUE (email)
);

-- Create MCP logs table for event tracking
CREATE TABLE IF NOT EXISTS public.mcp_logs (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  event_type TEXT NOT NULL,
  user_id TEXT,
  session_id TEXT,
  platform TEXT,
  app_version TEXT,
  payload JSONB,
  
  PRIMARY KEY (id)
);

-- Create sessions table for tracking user sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  platform TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  PRIMARY KEY (id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT uuid_generate_v4(),
  auth_user_id UUID NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  status TEXT DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  PRIMARY KEY (id),
  CONSTRAINT users_email_unique UNIQUE (email),
  CONSTRAINT users_auth_user_id_unique UNIQUE (auth_user_id)
);

-- Create index for better performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_mcp_logs_user_id ON public.mcp_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mcp_logs_timestamp ON public.mcp_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public.sessions(session_token);

-- Set up Row Level Security (RLS) policies

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to access their own profile
CREATE POLICY "Users can access their own profile" ON public.profiles
  FOR ALL USING (
    auth.uid() = id
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (
    auth.uid() = id
  );

-- Enable RLS on mcp_logs table
ALTER TABLE public.mcp_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to create logs
CREATE POLICY "Users can create logs" ON public.mcp_logs
  FOR INSERT WITH CHECK (
    true
  );

-- Allow users to read their own logs
CREATE POLICY "Users can read their own logs" ON public.mcp_logs
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Enable RLS on sessions table
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to access their own sessions
CREATE POLICY "Users can access their own sessions" ON public.sessions
  FOR ALL USING (
    auth.uid() = user_id
  );

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at timestamp
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a function to log user sign-ins
CREATE OR REPLACE FUNCTION log_user_signin()
RETURNS TRIGGER AS $$
DECLARE
  user_profile public.profiles;
BEGIN
  -- Check if user exists in profiles table
  SELECT * INTO user_profile FROM public.profiles WHERE id = NEW.user_id;
  
  -- If user doesn't exist, create a basic profile
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, username)
    VALUES (NEW.user_id, NEW.email, NEW.email);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for user sign-ins
CREATE TRIGGER trigger_log_user_signin
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION log_user_signin();