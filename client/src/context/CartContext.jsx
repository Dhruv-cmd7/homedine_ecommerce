import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Initial Cart Load
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      if (user) {
        try {
          // If logged in, fetch from DB
          const res = await api.get('/cart');
          setCartItems(res.data.data.items || []);
          
          // If there are guest cart items left, merge them
          const guestCart = localStorage.getItem('homedine_guest_cart');
          if (guestCart) {
            const parsed = JSON.parse(guestCart);
            if (parsed.length > 0) {
              const mergeRes = await api.post('/cart/merge', { items: parsed });
              setCartItems(mergeRes.data.data.items || []);
              localStorage.removeItem('homedine_guest_cart');
            }
          }
        } catch (err) {
          console.error('Error fetching online cart:', err.message);
        }
      } else {
        // If guest, load from localStorage
        const guestCart = localStorage.getItem('homedine_guest_cart');
        if (guestCart) {
          setCartItems(JSON.parse(guestCart));
        } else {
          setCartItems([]);
        }
      }
      setLoading(false);
    };

    loadCart();
  }, [user]);

  // Sync state changes helper for update operations
  const syncCart = async (newItems) => {
    setCartItems(newItems);
    if (user) {
      try {
        const payload = newItems.map(item => ({
          product: item.product._id || item.product,
          variantSku: item.variantSku,
          quantity: item.quantity
        }));
        await api.put('/cart', { items: payload });
      } catch (err) {
        console.error('Failed to sync cart updates online:', err.message);
      }
    } else {
      localStorage.setItem('homedine_guest_cart', JSON.stringify(newItems));
    }
  };

  const addToCart = async (product, variantSku, quantity = 1) => {
    const existingIndex = cartItems.findIndex(
      item => (item.product._id || item.product) === product._id && item.variantSku === variantSku
    );

    let updated;
    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
    } else {
      updated = [...cartItems, { product, variantSku, quantity }];
    }

    await syncCart(updated);
  };

  const updateQuantity = async (productId, variantSku, quantity) => {
    if (quantity < 1) return;
    const updated = cartItems.map(item => {
      const matchId = item.product._id || item.product;
      if (matchId === productId && item.variantSku === variantSku) {
        return { ...item, quantity };
      }
      return item;
    });
    await syncCart(updated);
  };

  const removeFromCart = async (productId, variantSku) => {
    const updated = cartItems.filter(item => {
      const matchId = item.product._id || item.product;
      return !(matchId === productId && item.variantSku === variantSku);
    });
    await syncCart(updated);
  };

  const clearCart = async () => {
    await syncCart([]);
  };

  // Derived Properties
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      cartCount,
      cartSubtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
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
