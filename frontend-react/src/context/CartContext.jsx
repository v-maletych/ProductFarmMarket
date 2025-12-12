import React, {createContext, useState, useContext, useEffect} from 'react';
import toast from 'react-hot-toast';
import {useUser} from './UserContext';

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const {authData} = useUser();
    const cartKey = authData.isAuthenticated && authData.userId
        ? `farmmarket_cart_${authData.userId}`
        : `farmmarket_cart_guest`;

    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        try {
            const storedCart = localStorage.getItem(cartKey);
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Помилка завантаження кошика:", error);
            setCartItems([]);
        }
    }, [cartKey]);

    useEffect(() => {
        try {
            if (cartItems.length > 0 || localStorage.getItem(cartKey)) {
                localStorage.setItem(cartKey, JSON.stringify(cartItems));
            }
        } catch (error) {
            console.error("Помилка збереження кошика:", error);
        }
    }, [cartItems, cartKey]);

    const updateQuantityInternal = (prevItems, productId, delta) => {
        return prevItems.map(item =>
            item.productId === productId ? {...item, quantity: item.quantity + delta} : item
        );
    };

    const addToCart = (product) => {
        const pId = product.productId || product.id;

        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => (item.productId || item.id) === pId);
            if (existingItem) {
                toast.success(`Кількість збільшено: ${product.name}`);
                return updateQuantityInternal(prevItems, pId, 1);
            }
            const newItem = {
                productId: pId,
                id: pId,
                name: product.name,
                price: product.price,
                image: product.image,
                unit: product.unit,
                quantity: 1
            };
            toast.success(`${product.name} додано в кошик! 🛒`);
            return [...prevItems, newItem];
        });
    };

    const decreaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => (item.productId || item.id) === productId);
            if (!existingItem) return prevItems;
            if (existingItem.quantity === 1) {
                return prevItems.filter(item => (item.productId || item.id) !== productId);
            } else {
                return updateQuantityInternal(prevItems, productId, -1);
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => (item.productId || item.id) !== productId));
        toast.error("Товар видалено.");
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem(cartKey);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart, decreaseQuantity, clearCart, getCartTotal, getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);