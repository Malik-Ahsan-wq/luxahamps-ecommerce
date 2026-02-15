import { WHATSAPP_CONFIG } from '@/config/whatsapp'

interface ProductOrderData {
  name: string
  price: number
  quantity?: number
  url: string
}

interface CartItem {
  name: string
  price: number
  quantity: number
}

export const generateProductOrderMessage = (data: ProductOrderData): string => {
  const { name, price, quantity = 1, url } = data
  
  return `Hello, I want to order this product:

Product: ${name}
Price: Rs ${price.toFixed(2)}
Quantity: ${quantity}
Link: ${url}`
}

export const generateCartOrderMessage = (items: CartItem[], cartUrl: string): string => {
  const productsList = items.map((item, index) => 
    `${index + 1}. ${item.name} - Rs ${item.price.toFixed(2)} x${item.quantity}`
  ).join('\n')
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  return `Hello, I want to place an order:

Products:
${productsList}

Total: Rs ${total.toFixed(2)}
Link: ${cartUrl}`
}

export const openWhatsApp = (message: string): void => {
  const encodedMessage = encodeURIComponent(message)
  const url = `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`
  window.open(url, '_blank')
}
