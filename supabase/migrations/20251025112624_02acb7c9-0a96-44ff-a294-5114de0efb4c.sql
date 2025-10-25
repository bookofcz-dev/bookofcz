-- Add RLS policy to allow admins to delete books
CREATE POLICY "Admins can delete books"
ON public.marketplace_books
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.wallet_address = 
      LOWER((current_setting('request.jwt.claims'::text, true))::json ->> 'wallet_address'::text)
      AND user_roles.role = 'admin'::app_role
  )
);