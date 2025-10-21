-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (wallet_address, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_wallet_address TEXT, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE wallet_address = _wallet_address
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Anyone can view roles"
  ON public.user_roles
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON public.user_roles
  FOR ALL
  USING (has_role((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text, 'admin'));

-- Insert admin role for the specified wallet
INSERT INTO public.user_roles (wallet_address, role)
VALUES ('0x6e22449bEbc5C719fA7ADB39bc2576B9E6F11bd8', 'admin');