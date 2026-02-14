"use client";

import React, { useEffect, useState } from "react";
import { useProductStore, Product } from "@/store/useProductStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil, Trash2, MoreHorizontal, ImagePlus, X } from "lucide-react";
import Image from "next/image";

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, setProducts } = useProductStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [gallery, setGallery] = useState<Array<{ id: string; image_url: string; color_variant?: string | null }>>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const initialFormState = {
    name: "",
    price: "",
    category: "",
    image: "",
    inStock: "true",
    description: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        image: product.image,
        inStock: product.inStock.toString(),
        description: product.description || "",
      });
      ;(async () => {
        try {
          const res = await fetch(`/api/products/${encodeURIComponent(String(product.id))}/images`, { cache: 'no-store' })
          const data = res.ok ? await res.json() : []
          setGallery(Array.isArray(data) ? data : [])
        } catch { setGallery([]) }
      })()
    } else {
      setEditingProduct(null);
      setFormData(initialFormState);
      setGallery([])
      setGalleryFiles([])
    }
    setIsDialogOpen(true);
  };

  // Products are managed in the store and persisted; no sync needed here

  const handleSave = async () => {
    const productData: Product = {
      id: editingProduct ? editingProduct.id : Math.random().toString(36).substr(2, 9),
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      image: formData.image || "https://images.unsplash.com/photo-1555982105-d25af9c5cfaf?w=500&auto=format&fit=crop&q=60", // Placeholder if empty
      colors: editingProduct ? editingProduct.colors : ["Default"], // Simplified for demo
      sizes: editingProduct ? editingProduct.sizes : ["One Size"],   // Simplified for demo
      inStock: formData.inStock === "true",
      description: formData.description,
    };

    if (editingProduct) {
      await updateProduct(productData);
      if (galleryFiles.length > 0) {
        try {
          setUploading(true)
          const fd = new FormData()
          galleryFiles.forEach((f) => fd.append('files', f))
          await fetch(`/api/products/${encodeURIComponent(String(productData.id))}/images`, { method: 'POST', body: fd })
          setGalleryFiles([])
          const res = await fetch(`/api/products/${encodeURIComponent(String(productData.id))}/images`, { cache: 'no-store' })
          const data = res.ok ? await res.json() : []
          setGallery(Array.isArray(data) ? data : [])
        } catch {} finally { setUploading(false) }
      }
    } else {
      await addProduct(productData);
      // Find newly created product id from store by name and price fallback
      let createdId = productData.id
      try {
        const latest = useProductStore.getState().products.find(p => p.name === productData.name && p.price === productData.price)
        if (latest) createdId = latest.id
      } catch {}
      if (galleryFiles.length > 0) {
        try {
          setUploading(true)
          const fd = new FormData()
          galleryFiles.forEach((f) => fd.append('files', f))
          await fetch(`/api/products/${encodeURIComponent(String(createdId))}/images`, { method: 'POST', body: fd })
          setGalleryFiles([])
        } catch {} finally { setUploading(false) }
      }
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
<div className="p-8 space-y-8 min-h-screen bg-white">
  {/* Header Section */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-8">
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Products</h1>
      <p className="text-slate-500 mt-1 font-medium">
        Manage your store inventory, pricing, and availability.
      </p>
    </div>
    <Button 
      onClick={() => handleOpenDialog()} 
      className="w-full sm:w-auto shadow-md bg-blue-600 hover:bg-blue-700 text-white transition-all active:scale-95"
    >
      <Plus className="mr-2 h-5 w-5" /> Add Product
    </Button>
  </div>

  {/* Desktop Table View */}
  <div className="hidden md:block rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <Table>
      <TableHeader className="bg-slate-50/50">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[100px] py-4 font-bold text-slate-600">Image</TableHead>
          <TableHead className="font-bold text-slate-600">Name</TableHead>
          <TableHead className="font-bold text-slate-600">Category</TableHead>
          <TableHead className="font-bold text-slate-600">Price</TableHead>
          <TableHead className="font-bold text-slate-600">Stock</TableHead>
          <TableHead className="text-right font-bold text-slate-600 pr-8">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="group hover:bg-blue-50/30 transition-colors">
            <TableCell className="py-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-transform group-hover:scale-105">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </TableCell>
            <TableCell className="font-bold text-slate-900 text-base">{product.name}</TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700 uppercase tracking-widest border border-indigo-100">
                {product.category}
              </span>
            </TableCell>
            <TableCell className="font-heavy text-slate-900">
              <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${
                  product.inStock
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-rose-500"}`} />
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </TableCell>
            <TableCell className="text-right pr-8">
              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenDialog(product)}
                  className="h-9 w-9 rounded-lg border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 shadow-sm"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-lg border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 shadow-sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>

  {/* Mobile Card View */}
  <div className="grid grid-cols-1 gap-4 md:hidden">
    {products.map((product) => (
      <div key={product.id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm active:scale-[0.98] transition-all">
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-100 shadow-inner">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex justify-between items-start">
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter mb-1">{product.category}</p>
               <span className={`h-2 w-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-rose-500"}`} />
            </div>
            <h3 className="font-bold text-slate-900 truncate leading-tight">{product.name}</h3>
            <p className="font-black text-lg text-slate-900 mt-1">{formatPrice(product.price)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-50">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
              product.inStock ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
            }`}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="h-8 rounded-lg font-bold text-xs" onClick={() => handleOpenDialog(product)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400" onClick={() => handleDelete(product.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Professional Dialog Layout */}
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent className="sm:max-w-[550px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
      <div className="bg-slate-900 p-8 text-white">
        <DialogTitle className="text-2xl font-bold">{editingProduct ? "Edit Product" : "New Product"}</DialogTitle>
        <DialogDescription className="text-slate-400 mt-1">
            Fill in the information below to sync with your store inventory.
        </DialogDescription>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Product Name</Label>
          <Input className="h-12 bg-slate-50 border-slate-200 focus:ring-blue-500/20" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Price (USD)</Label>
            <Input type="number" className="h-12 bg-slate-50" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Category</Label>
            <Input className="h-12 bg-slate-50" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Visuals</Label>
          <div className="flex items-center gap-4">
            {formData.image ? (
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-slate-100 group">
                <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setFormData({ ...formData, image: "" })} className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                   <X className="text-white h-6 w-6" />
                </button>
              </div>
            ) : (
              <label className="flex h-24 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 hover:bg-slate-50 transition-all">
                <ImagePlus className="h-6 w-6 text-slate-400 mr-2" />
                <span className="text-sm font-bold text-slate-500">Upload Product Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Gallery Images</Label>
          {gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-xl border">
                  <img src={img.image_url} alt="Gallery" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white/90 text-rose-600 text-xs font-bold px-2 py-1 rounded"
                    onClick={async () => {
                      try {
                        await fetch(`/api/products/images/${encodeURIComponent(String(img.id))}`, { method: 'DELETE' })
                        setGallery((prev) => prev.filter((g) => g.id !== img.id))
                      } catch {}
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []).filter((f) => f.type.startsWith('image/'))
              setGalleryFiles(files as File[])
            }}
          />
          {galleryFiles.length > 0 && (
            <div className="text-xs text-slate-500">{galleryFiles.length} file(s) selected</div>
          )}
          {uploading && <div className="text-xs text-slate-500">Uploading images...</div>}
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-500 tracking-widest">Status</Label>
                <Select value={formData.inStock} onValueChange={(val) => setFormData({ ...formData, inStock: val })}>
                    <SelectTrigger className="h-12 bg-slate-50"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="true">In Stock</SelectItem><SelectItem value="false">Out of Stock</SelectItem></SelectContent>
                </Select>
            </div>
            <Button onClick={handleSave} className="h-12 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-200">
                {editingProduct ? "Update Product" : "Create Product"}
            </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</div>
  );
}
