-- Allow anyone to check if a wallet address is an admin
-- This is safe because wallet addresses are public information
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Anyone can check admin status by wallet"
ON public.user_roles
FOR SELECT
TO public
USING (true);

-- Keep the admin-only management policy
-- (this one is fine since it's for INSERT/UPDATE/DELETE)