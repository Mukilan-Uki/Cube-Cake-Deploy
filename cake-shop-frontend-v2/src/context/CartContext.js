// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Calculate total items and price
    const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const total = cartItems.reduce((sum, item) => {
      const price = item.priceLKR || item.totalPrice || 0;
      return sum + (price * (item.quantity || 1));
    }, 0);
    
    setCartCount(count);
    setCartTotal(total);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems(prevItems => {
      // Check if item already exists (by id or custom design)
      const existingItemIndex = prevItems.findIndex(
        i => i.id === item.id || 
             (i.designId && i.designId === item.designId) ||
             (i.orderId && i.orderId === item.orderId)
      );

      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: (updatedItems[existingItemIndex].quantity || 1) + 1
        };
        return updatedItems;
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => 
      item.id !== itemId && 
      item.designId !== itemId && 
      item.orderId !== itemId
    ));
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId || item.designId === itemId || item.orderId === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get cart item count
  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.priceLKR || item.totalPrice || 0;
      return sum + (price * (item.quantity || 1));
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount,
      getSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};