-- Create product_gallery table for storing multiple images per product
CREATE TABLE IF NOT EXISTS product_gallery (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_gallery_product_id ON product_gallery(product_id);

-- Enable Row Level Security (optional, adjust policies as needed)
ALTER TABLE product_gallery ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON product_gallery
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage gallery" ON product_gallery
  FOR ALL USING (auth.role() = 'authenticated');