import React, { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

// 1. Створюємо контекст
const CartContext = createContext();

// 2. Створюємо провайдер
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // --- ФУНКЦІЯ ДОДАВАННЯ (ПОВНИЙ КОД) ---
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Перевіряємо, чи є вже такий товар у кошику
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      // Якщо немає, додаємо новий з кількістю 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
    
    toast.success(`${product.name} Додано в кошик! 🛒`); 
  };

  // --- ФУНКЦІЯ ВИДАЛЕННЯ ---
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    toast.error("Товар видалено з кошика.");
  };

  // --- ФУНКЦІЯ ОЧИЩЕННЯ (НОВА) ---
  const clearCart = () => {
    setCartItems([]);
    toast.error("Кошик було очищено.");
  };

  // --- ПІДРАХУНКИ ---
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // --- ПОВЕРТАЄМО ВСЕ ЦЕ КОМПОНЕНТАМ ---
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,     // <--- Ось тут ми додали нову функцію
      getCartTotal, 
      getCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Хук
export const useCart = () => useContext(CartContext);