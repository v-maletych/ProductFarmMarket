import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

// Ключ, під яким ми будемо зберігати дані в localStorage
const STORAGE_KEY = 'farmmarket_cart';

// 1. Створюємо контекст
const CartContext = createContext();

// 2. Створюємо провайдер
export const CartProvider = ({ children }) => {
    // 1. Ініціалізація стану:
    // При першому завантаженні намагаємося дістати дані з localStorage.
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem(STORAGE_KEY);
            // Якщо дані є, парсимо їх. Якщо ні, повертаємо порожній масив.
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Помилка завантаження кошика з localStorage:", error);
            return []; // У разі помилки повертаємо порожній кошик
        }
    });

    // 2. Збереження стану:
    // Викликається щоразу, коли cartItems змінюється.
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.error("Помилка збереження кошика в localStorage:", error);
        }
    }, [cartItems]);


    // --- ВНУТРІШНЯ ФУНКЦІЯ: Оновлює кількість (НЕ викликає сповіщення) ---
    const updateQuantityInternal = (prevItems, productId, delta) => {
        return prevItems.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity + delta } : item
        );
    };

    // --- ВНУТРІШНЯ ФУНКЦІЯ: Додає новий товар (НЕ викликає сповіщення) ---
    const addNewItemInternal = (prevItems, product) => {
        return [...prevItems, { ...product, quantity: 1 }];
    };


    // --- ФУНКЦІЯ ДОДАВАННЯ (ЗОВНІШНЯ) ---
    const addToCart = (product) => {
        let itemAlreadyExists = false;

        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);

            if (existingItem) {
                itemAlreadyExists = true;
                return updateQuantityInternal(prevItems, product.id, 1);
            }

            return addNewItemInternal(prevItems, product);
        });

        if (!itemAlreadyExists) {
            toast.success(`${product.name} Додано в кошик! 🛒`);
        }
    };


    // --- ФУНКЦІЯ ЗМЕНШЕННЯ КІЛЬКОСТІ ---
    const decreaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === productId);

            if (!existingItem) return prevItems;

            if (existingItem.quantity === 1) {
                toast.error("Товар видалено з кошика.");
                return prevItems.filter(item => item.id !== productId);
            } else {
                return updateQuantityInternal(prevItems, productId, -1);
            }
        });
    };

    // --- ФУНКЦІЯ ВИДАЛЕННЯ (ПОВНЕ) ---
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        toast.error("Товар видалено з кошика.");
    };

    // --- ФУНКЦІЯ ОЧИЩЕННЯ ---
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
            decreaseQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

// 3. Хук
export const useCart = () => useContext(CartContext);