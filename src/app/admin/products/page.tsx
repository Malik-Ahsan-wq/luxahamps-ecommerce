'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, X } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  image: string
  stock: number
  galleryImages?: string[]
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    mainImage: '',
    galleryImages: [] as string[]
  })

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.replace('/admin')
      return
    }
    loadProducts()
  }, [router])

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' })
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load products:', error)
    }
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    )
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Cloudinary upload error:', errorData)
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`)
    }
    
    const data = await response.json()
    console.log('Cloudinary upload success:', data.secure_url)
    return data.secure_url
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain = true) => {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    try {
      if (isMain) {
        const url = await uploadToCloudinary(files[0])
        setFormData(prev => ({ ...prev, mainImage: url }))
      } else {
        const urls = await Promise.all(Array.from(files).map(uploadToCloudinary))
        console.log('Gallery images uploaded:', urls)
        setFormData(prev => ({ 
          ...prev, 
          galleryImages: [...prev.galleryImages, ...urls] 
        }))
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.mainImage) {
      alert('Please fill all required fields and upload main image')
      return
    }

    setLoading(true)
    try {
      const productData = {
        title: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.mainImage,
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        gallery_images: formData.galleryImages
      }

      console.log('Saving product with data:', productData)

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PATCH' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to save product')
      }
      
      const savedProduct = await res.json()
      console.log('Product saved successfully:', savedProduct)

      resetForm()
      loadProducts()
      alert(editingProduct ? 'Product updated!' : 'Product created!')
    } catch (error) {
      console.error('Save failed:', error)
      alert(`Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: '',
      stock: '',
      mainImage: '',
      galleryImages: []
    })
    setShowForm(false)
    setEditingProduct(null)
  }

  const editProduct = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      stock: product.stock.toString(),
      mainImage: product.image,
      galleryImages: product.galleryImages || []
    })
    setEditingProduct(product)
    setShowForm(true)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      loadProducts()
      alert('Product deleted!')
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete product')
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(true)}>Add Product</Button>
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            Dashboard
          </Button>
          <Button variant="outline" onClick={() => {
            localStorage.removeItem('admin_session')
            router.replace('/admin')
          }}>
            Logout
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label>Main Image *</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    disabled={uploading}
                  />
                  {formData.mainImage && (
                    <div className="relative w-20 h-20">
                      <Image
                        src={formData.mainImage}
                        alt="Main"
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Gallery Images (Optional - Max 10)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, false)}
                  disabled={uploading || formData.galleryImages.length >= 10}
                />
                {formData.galleryImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.galleryImages.map((url, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <Image
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formData.galleryImages.length}/10 images uploaded
                </p>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading || uploading}>
                  {loading ? 'Saving...' : uploading ? 'Uploading...' : 'Save Product'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="font-bold">${product.price}</p>
                  <p className="text-sm">Stock: {product.stock}</p>
                  <p className="text-sm text-gray-500">
                    Gallery: {product.galleryImages?.length || 0} images
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => editProduct(product)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found. Add your first product!
          </div>
        )}
      </div>
    </div>
  )
}