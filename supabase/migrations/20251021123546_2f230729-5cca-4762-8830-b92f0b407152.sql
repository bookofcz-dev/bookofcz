-- Add policies for the marketplace bucket (the one currently being used)
DROP POLICY IF EXISTS "Allow all operations on marketplace" ON storage.objects;

CREATE POLICY "Allow all operations on marketplace"
ON storage.objects
FOR ALL
USING (bucket_id = 'marketplace')
WITH CHECK (bucket_id = 'marketplace');