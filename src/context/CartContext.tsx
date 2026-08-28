import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { useShop } from './ShopContext';

export interface AddedToCartEvent {
  id: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  totalOriginalPrice: number;
  totalSavings: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  lastAddedNotification: AddedToCartEvent | null;
  dismissAddedNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sivakasi_fireworks_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedNotification, setLastAddedNotification] = useState<AddedToCartEvent | null>(null);
  const { showToast } = useShop();

  const dismissAddedNotification = React.useCallback(() => {
    setLastAddedNotification(null);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock!`, 'error');
      return;
    }

    const actualQty = Math.max(1, quantity);
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      const newQty = Math.min(product.stock, existing.quantity + actualQty);
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        )
      );
      showToast(`Updated "${product.name}" in cart (${newQty})`, 'success');
      setLastAddedNotification({
        id: Date.now().toString(),
        product,
        quantity: actualQty
      });
    } else {
      const addQty = Math.min(product.stock, actualQty);
      setCart((prev) => [...prev, { product, quantity: addQty }]);
      showToast(`Added "${product.name}" to cart successfully!`, 'success');
      setLastAddedNotification({
        id: Date.now().toString(),
        product,
        quantity: addQty
      });
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxQty = item.product.stock > 0 ? item.product.stock : 999;
          const finalQty = Math.min(maxQty, quantity);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      showToast(`Removed "${item.product.name}" from cart`, 'info');
    }
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalOriginalPrice = cart.reduce(
    (sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );

  const totalSavings = Math.max(0, totalOriginalPrice - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        totalOriginalPrice,
        totalSavings,
        isCartOpen,
        setIsCartOpen,
        lastAddedNotification,
        dismissAddedNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
