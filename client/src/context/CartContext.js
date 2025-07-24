// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const userId = user?._id || user?.id;

  // Listen for login/logout in other tabs or programmatically
  useEffect(() => {
    const handleStorage = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user')));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Listen for login/logout in this tab (e.g., after login/logout button)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const current = JSON.stringify(user);
        const latest = localStorage.getItem('user');
        if (current !== latest) {
          setUser(JSON.parse(latest));
        }
      } catch {
        setUser(null);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [user]);

  const fetchCart = async () => {
    if (!userId) {
      setCartItems([]);
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId.toString()}`);
      setCartItems(res.data);
    } catch (err) {
      setCartItems([]);
      console.error('Fetch cart error:', err);
    }
  };

  const addToCart = async (product) => {
    if (!userId) return;
    try {
      const existingItem = cartItems.find(item => item.productId === product.productId);
      if (existingItem) {
        await axios.put(`http://localhost:5000/api/cart/${existingItem._id}`, {
          quantity: existingItem.quantity + (product.quantity || 1)
        });
      } else {
        await axios.post(`http://localhost:5000/api/cart`, {
          ...product,
          userId,
          quantity: product.quantity || 1
        });
      }
      fetchCart();
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  const increaseQty = async (item) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/${item._id}`, {
        quantity: item.quantity + 1
      });
      fetchCart();
    } catch (err) {
      console.error('Increase qty error:', err);
    }
  };

  const decreaseQty = async (item) => {
    if (item.quantity <= 1) return removeItem(item);
    try {
      await axios.put(`http://localhost:5000/api/cart/${item._id}`, {
        quantity: item.quantity - 1
      });
      fetchCart();
    } catch (err) {
      console.error('Decrease qty error:', err);
    }
  };

  const removeItem = async (item) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${item._id}`);
      fetchCart();
    } catch (err) {
      console.error('Remove item error:', err);
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    try {
      await axios.delete(`http://localhost:5000/api/cart/clear/${userId}`);
      setCartItems([]);
    } catch (err) {
      console.error('Clear cart error:', err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
