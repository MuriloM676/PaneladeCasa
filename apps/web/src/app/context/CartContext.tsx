"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  dishId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  chefId: string;
};

export type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (dishId: string) => void;
  clearCart: () => void;
  updateQuantity: (dishId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

const CART_KEY = 'paneladecasa_cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.dishId === item.dishId);
      if (existing) {
        return prev.map(i =>
          i.dishId === item.dishId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (dishId: string) => {
    setItems(prev => prev.filter(i => i.dishId !== dishId));
  };

  const clearCart = () => setItems([]);

  const updateQuantity = (dishId: string, quantity: number) => {
    setItems(prev =>
      prev.map(i => (i.dishId === dishId ? { ...i, quantity } : i))
    );
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
