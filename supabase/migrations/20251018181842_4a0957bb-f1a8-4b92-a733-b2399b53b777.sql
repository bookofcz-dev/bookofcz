-- Create book_views table to track view counts
CREATE TABLE public.book_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id TEXT NOT NULL UNIQUE,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.book_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read view counts
CREATE POLICY "Anyone can view book counts"
ON public.book_views
FOR SELECT
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_book_view(book_identifier TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.book_views (book_id, view_count)
  VALUES (book_identifier, 1)
  ON CONFLICT (book_id)
  DO UPDATE SET 
    view_count = book_views.view_count + 1,
    updated_at = now();
END;
$$;

-- Allow anyone to call the increment function
GRANT EXECUTE ON FUNCTION public.increment_book_view TO anon, authenticated;

-- Create trigger for updated_at
CREATE TRIGGER update_book_views_updated_at
BEFORE UPDATE ON public.book_views
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();