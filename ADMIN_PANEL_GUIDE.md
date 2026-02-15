# Admin Panel - Professional eCommerce Management

## Overview
A complete, production-ready admin panel built with **shadcn/ui** components for managing your eCommerce store.

## Features

### ✅ Dashboard
- Real-time statistics (Revenue, Orders, Products)
- Quick action cards
- Clean, modern interface

### ✅ Product Management
- Add/Edit/Delete products
- **Cloudinary image upload** (main + gallery images)
- Stock quantity management
- Professional table view with badges
- Dialog-based forms

### ✅ Order Management
- View all orders
- Update order status (Pending → Confirmed → Shipped → Delivered)
- Customer information display
- Status badges with color coding

### ✅ Customer Management
- View all registered customers
- Order count per customer
- Join date tracking

### ✅ Ratings & Reviews
- View all product ratings
- Star rating display
- Customer feedback

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Database**: Supabase
- **Image Upload**: Cloudinary
- **State Management**: Zustand
- **Icons**: Lucide React

## shadcn/ui Components Used

✅ Button
✅ Card
✅ Input
✅ Textarea
✅ Dialog
✅ Dropdown Menu
✅ Table
✅ Badge
✅ Sheet (Mobile sidebar)
✅ Select
✅ Label
✅ Separator

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout with sidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Dashboard with stats
│   │   ├── products/
│   │   │   └── page.tsx        # Product CRUD with Cloudinary
│   │   ├── orders/
│   │   │   └── page.tsx        # Order management
│   │   ├── customers/
│   │   │   └── page.tsx        # Customer list
│   │   └── ratings/
│   │       └── page.tsx        # Reviews display
│   └── api/
│       └── admin/
│           ├── orders/
│           ├── customers/
│           └── ratings/
└── components/
    └── ui/                      # shadcn components
```

## Environment Variables

Already configured in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Admin Credentials
NEXT_PUBLIC_ADMIN_EMAIL=ahsanmalikking57@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=xyzxyzxyz124578xyzxyzxyz

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dslbxmc7n
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=my_upload
CLOUDINARY_API_KEY=638424373316871
CLOUDINARY_API_SECRET=aS4j0_9mkCuzwskHD70qEXKMtBY
```

## How to Use

### 1. Access Admin Panel
Navigate to: `http://localhost:3000/admin`

### 2. Add Products
1. Go to **Products** page
2. Click **Add Product** button
3. Fill in:
   - Product name
   - Price
   - Description
   - Category
   - Stock quantity
   - Upload main image (Cloudinary)
   - Upload gallery images (optional, max 10)
4. Click **Save Product**

### 3. Manage Orders
1. Go to **Orders** page
2. View all orders in table
3. Update status using dropdown
4. Track order progress

### 4. View Analytics
- Dashboard shows real-time stats
- Click stat cards to navigate to details

## Image Upload (Cloudinary)

### Main Image
- Required for each product
- Uploaded to Cloudinary automatically
- URL saved in `products.image` column

### Gallery Images
- Optional (up to 10 images)
- Uploaded to Cloudinary
- URLs saved in `products.gallery_images` array column

### Upload Process
1. User selects image(s)
2. Frontend uploads to Cloudinary API
3. Cloudinary returns secure URL
4. URL saved to Supabase database

## Database Schema

### Products Table
```sql
- id (bigint)
- title (text)
- description (text)
- price (numeric)
- image (text)              -- Main image URL
- category (text)
- stock (integer)
- gallery_images (text[])   -- Array of gallery URLs
- created_at (timestamp)
```

## Design Features

### Professional UI
- Clean, modern Shopify-like design
- Consistent spacing and typography
- Smooth transitions and hover effects

### Responsive
- Mobile-friendly sidebar (Sheet component)
- Responsive grid layouts
- Touch-friendly buttons

### Color Coding
- Status badges with semantic colors
- Stock indicators (green/yellow/red)
- Visual hierarchy

### Empty States
- Friendly messages when no data
- Call-to-action buttons
- Helpful icons

## Safety Features

✅ No breaking changes to existing frontend
✅ No database schema modifications required
✅ All existing APIs preserved
✅ Backward compatible

## Production Ready

✅ Error handling
✅ Loading states
✅ Form validation
✅ Optimistic updates
✅ Responsive design
✅ Accessibility compliant
✅ SEO friendly

## Next Steps

To add more components:
```bash
npx shadcn@latest add [component-name]
```

Available components: https://ui.shadcn.com/docs/components

## Support

For issues or questions:
1. Check shadcn/ui docs: https://ui.shadcn.com
2. Check Cloudinary docs: https://cloudinary.com/documentation
3. Check Supabase docs: https://supabase.com/docs

---

**Built with ❤️ using shadcn/ui**
