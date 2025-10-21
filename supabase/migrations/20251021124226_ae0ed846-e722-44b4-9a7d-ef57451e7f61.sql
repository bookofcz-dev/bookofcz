-- Make the marketplace bucket public so covers can be viewed
UPDATE storage.buckets 
SET public = true 
WHERE id = 'marketplace';