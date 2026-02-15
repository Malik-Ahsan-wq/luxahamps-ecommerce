-- Add gallery_images column to products table to store array of Cloudinary URLs
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images TEXT[];

-- Update existing products to have empty gallery array if null
UPDATE products SET gallery_images = '{}' WHERE gallery_images IS NULL;