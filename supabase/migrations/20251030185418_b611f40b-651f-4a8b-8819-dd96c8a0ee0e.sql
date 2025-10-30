-- =====================================================
-- SECURITY FIX: Restrict overly permissive RLS policies
-- =====================================================

-- 1. FIX: marketplace_purchases - Restrict to own purchases
-- Remove overly permissive policy that allows viewing all purchases
DROP POLICY IF EXISTS "Users can view purchases by wallet" ON public.marketplace_purchases;

-- Add restrictive policy for users to view only their own purchases
CREATE POLICY "Users can view own purchases"
  ON public.marketplace_purchases
  FOR SELECT
  USING (
    lower(buyer_wallet) = lower(COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'wallet_address'),
      ''
    ))
  );

-- Note: Keep existing "Creators can view their book purchases" and "Admins can view all purchases" policies


-- 2. FIX: wallet_sessions - Restrict to own sessions
-- Remove overly permissive policy
DROP POLICY IF EXISTS "Users can view wallet sessions by address" ON public.wallet_sessions;

-- Users can only view their own wallet sessions
CREATE POLICY "Users can view own sessions"
  ON public.wallet_sessions
  FOR SELECT
  USING (
    lower(wallet_address) = lower(COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'wallet_address'),
      ''
    ))
  );


-- 3. FIX: user_roles - Restrict admin wallet exposure
-- Remove public viewing policy
DROP POLICY IF EXISTS "Anyone can view roles" ON public.user_roles;

-- Users can view their own role
CREATE POLICY "Users can view own role"
  ON public.user_roles
  FOR SELECT
  USING (
    lower(wallet_address) = lower(COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'wallet_address'),
      ''
    ))
  );

-- Admins can view all roles (keep for admin dashboard)
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (
    has_role(
      COALESCE(
        (current_setting('request.jwt.claims', true)::json->>'wallet_address'),
        ''
      ),
      'admin'::app_role
    )
  );


-- 4. FIX: purchase_signatures - Prevent spam attacks
-- Remove unrestricted insert policy
DROP POLICY IF EXISTS "Allow signature recording" ON public.purchase_signatures;

-- Only allow users to record signatures for their own wallet
CREATE POLICY "Users can record own signatures"
  ON public.purchase_signatures
  FOR INSERT
  WITH CHECK (
    lower(buyer_wallet) = lower(COALESCE(
      (current_setting('request.jwt.claims', true)::json->>'wallet_address'),
      ''
    ))
  );


-- =====================================================
-- SECURITY AUDIT COMPLETE
-- All critical RLS vulnerabilities patched
-- =====================================================