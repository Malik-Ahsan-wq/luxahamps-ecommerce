"use client";

import React, { useState } from "react";
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
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    } else {
      setEditingProduct(null);
      setFormData(initialFormState);
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
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
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
   <div className="container mx-auto max-w-7xl p-4 md:p-8 space-y-8">
  {/* Header Section */}
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 pb-6">
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Products</h1>
      <p className="text-muted-foreground mt-1 text-sm">
        Manage your store inventory, pricing, and availability.
      </p>
    </div>
    <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto shadow-sm">
      <Plus className="mr-2 h-4 w-4" /> Add Product
    </Button>
  </div>

  {/* Desktop Table View (Hidden on Mobile) */}
  <div className="hidden md:block rounded-xl border border-gray-300 bg-card shadow-sm overflow-hidden">
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead className="w-[80px]">Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
            <TableCell>
              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-300 bg-secondary">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </TableCell>
            <TableCell className="font-semibold">{product.name}</TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground uppercase tracking-wider">
                {product.category}
              </span>
            </TableCell>
            <TableCell className="font-medium text-primary">
              {formatPrice(product.price)}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                  product.inStock
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenDialog(product)}
                  className="hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
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

  {/* Mobile Card View (Hidden on Desktop) */}
  <div className="grid grid-cols-1 gap-4 md:hidden">
    {products.map((product) => (
      <div key={product.id} className="rounded-xl border border-gray-300 bg-card p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-300">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold truncate text-sm uppercase">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <p className="font-bold text-primary mt-1">{formatPrice(product.price)}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-300">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              product.inStock ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleOpenDialog(product)}>
              <Pencil className="h-3 w-3 mr-1" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(product.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Professional Dialog Layout */}
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-2xl">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogDescription>
          {editingProduct
            ? "Modify the fields below to update your product information."
            : "Enter the details to list a new product in your store."}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-6 py-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-sm font-semibold">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Wireless Headphones"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="price" className="text-sm font-semibold">Price (USD)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Electronics"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold">Product Image</Label>
          <div className="flex flex-wrap items-center gap-4">
            {formData.image ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-300 shadow-sm group">
                <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: "" })}
                  className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-primary hover:bg-gray-50 transition-all">
                <div className="rounded-full bg-gray-100 p-2 mb-2">
                  <ImagePlus className="h-6 w-6 text-gray-500" />
                </div>
                <span className="text-xs font-medium text-gray-600">Add Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="inStock" className="text-sm font-semibold">Inventory Status</Label>
          <Select
            value={formData.inStock}
            onValueChange={(val) => setFormData({ ...formData, inStock: val })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">In Stock</SelectItem>
              <SelectItem value="false">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief product summary..."
          />
        </div>
      </div>

      <DialogFooter className="gap-2 pt-2 border-t border-gray-300 mt-2">
        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="px-8 shadow-sm">
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</div>
  );
}
