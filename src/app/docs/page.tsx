'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, User, Package, Star, CreditCard, Truck, Search, Heart, MessageCircle } from 'lucide-react'
import Image from 'next/image'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Image src="/assets/mainlogo.cb44b92e.svg" alt="Logo" width={150} height={50} className="mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">How to Use Our Website</h1>
          <p className="text-lg text-slate-600">Complete guide to shopping and managing your account</p>
          <Badge className="mt-4">User Guide v1.0</Badge>
        </div>

        {/* Quick Start */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              🚀 Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</span>
              <p><strong>Browse Products:</strong> Explore our collection on the homepage</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</span>
              <p><strong>Add to Cart:</strong> Click "Add to Cart" on any product</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</span>
              <p><strong>Checkout:</strong> Review cart and complete your purchase</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Features */}
        <div className="space-y-6">
          {/* Browsing Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Browsing Products
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p><strong>Homepage:</strong> View featured products and latest arrivals</p>
              <p><strong>Product Cards:</strong> Each card shows image, name, price, and rating</p>
              <p><strong>Quick View:</strong> Click on any product for detailed information</p>
              <p><strong>Search:</strong> Use the search bar in navigation to find specific items</p>
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                Shopping Cart
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p><strong>Add Items:</strong> Click "Add to Cart" button on product pages</p>
              <p><strong>View Cart:</strong> Click cart icon in navbar to see your items</p>
              <p><strong>Update Quantity:</strong> Adjust quantities directly in cart</p>
              <p><strong>Remove Items:</strong> Click remove button to delete items</p>
              <p><strong>Cart Total:</strong> See real-time price calculations</p>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Account Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p><strong>Sign Up:</strong> Click "Login" in navbar, then "Create an account"</p>
              <p><strong>Login Options:</strong> Use email/password, Google, or GitHub</p>
              <p><strong>My Account:</strong> Access order history and profile settings</p>
              <p><strong>Order Tracking:</strong> View status of all your orders</p>
              <p><strong>Logout:</strong> Click your profile icon and select logout</p>
            </CardContent>
          </Card>

          {/* Checkout Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Checkout Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p><strong>Step 1:</strong> Review items in your cart</p>
              <p><strong>Step 2:</strong> Click "Proceed to Checkout"</p>
              <p><strong>Step 3:</strong> Enter shipping information</p>
              <p><strong>Step 4:</strong> Select payment method</p>
              <p><strong>Step 5:</strong> Confirm and place order</p>
              <p className="text-sm text-slate-500 italic">💡 You must be logged in to checkout</p>
            </CardContent>
          </Card>

          {/* Order Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p><strong>Order Status:</strong> Track your order in "My Account" section</p>
              <p><strong>Status Types:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><Badge variant="secondary">Pending</Badge> - Order received</li>
                <li><Badge className="bg-blue-500">Confirmed</Badge> - Order confirmed</li>
                <li><Badge className="bg-purple-500">Shipped</Badge> - On the way</li>
                <li><Badge className="bg-green-500">Delivered</Badge> - Completed</li>
              </ul>
            </CardContent>
          </Card>

          {/* Reviews & Ratings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Reviews & Ratings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p><strong>View Reviews:</strong> See customer reviews on product pages</p>
              <p><strong>Leave Review:</strong> Rate products after purchase</p>
              <p><strong>Star Rating:</strong> Give 1-5 stars based on your experience</p>
              <p><strong>Written Review:</strong> Share detailed feedback (optional)</p>
            </CardContent>
          </Card>

          {/* Wishlist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Wishlist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p><strong>Add to Wishlist:</strong> Click heart icon on products</p>
              <p><strong>View Wishlist:</strong> Access saved items from your account</p>
              <p><strong>Move to Cart:</strong> Easily add wishlist items to cart</p>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p><strong>WhatsApp:</strong> Click the WhatsApp button (bottom left) for instant support</p>
              <p><strong>Response Time:</strong> We typically respond within 24 hours</p>
              <p><strong>Support Hours:</strong> Monday - Saturday, 9 AM - 6 PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Tips & Best Practices */}
        <Card className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">💡 Tips & Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-slate-700">
            <p>✓ Create an account for faster checkout and order tracking</p>
            <p>✓ Add items to wishlist to save them for later</p>
            <p>✓ Check product reviews before purchasing</p>
            <p>✓ Keep your shipping information up to date</p>
            <p>✓ Contact support via WhatsApp for quick assistance</p>
            <p>✓ Leave reviews to help other customers</p>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">❓ Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-slate-900">Q: Do I need an account to shop?</p>
              <p className="text-slate-600">A: You can browse without an account, but need to login to checkout.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Q: How do I track my order?</p>
              <p className="text-slate-600">A: Go to "My Account" → "Orders" to see all order statuses.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Q: Can I cancel my order?</p>
              <p className="text-slate-600">A: Contact support via WhatsApp immediately after placing order.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Q: What payment methods do you accept?</p>
              <p className="text-slate-600">A: We accept all major credit cards and online payment methods.</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-600">
          <p>Need more help? Contact us via WhatsApp!</p>
          <p className="text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
