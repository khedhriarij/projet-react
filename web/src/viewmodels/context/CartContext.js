import { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const db = firebase.firestore();

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('edu_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        setCartCount(parsedCart.length);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('edu_cart', JSON.stringify(cartItems));
    setCartCount(cartItems.length);
  }, [cartItems]);

  const addToCart = (course) => {
    setCartItems(prev => {
      // Check if course already in cart
      const exists = prev.find(item => item.id === course.id);
      if (exists) {
        return prev; // Don't add duplicate
      }
      return [...prev, {
        ...course,
        cartId: Date.now().toString(), // Unique ID for cart item
        addedAt: new Date().toISOString()
      }];
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};