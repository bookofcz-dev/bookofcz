-- Fix book_views RLS policies to prevent manipulation

-- Block all direct modifications to book_views table
-- This forces all increments through the secure increment_book_view() function

DROP POLICY IF EXISTS "No direct inserts on book_views" ON book_views;
DROP POLICY IF EXISTS "No direct updates on book_views" ON book_views;
DROP POLICY IF EXISTS "No direct deletes on book_views" ON book_views;

CREATE POLICY "No direct inserts on book_views"
ON book_views FOR INSERT
WITH CHECK (false);

CREATE POLICY "No direct updates on book_views"
ON book_views FOR UPDATE
USING (false);

CREATE POLICY "No direct deletes on book_views"
ON book_views FOR DELETE
USING (false);