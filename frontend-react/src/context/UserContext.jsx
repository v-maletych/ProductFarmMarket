import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { getAxiosClient } from '../api/axiosClient';
import baseClient from '../api/axiosClient';
import { Navigate } from 'react-router-dom';

// 1. Створюємо контекст
const UserContext = createContext();

// 💡 ДОПОМІЖНА ФУНКЦІЯ: Форматування ролі (беремо її з Profile.jsx, щоб уникнути помилок)
const getRoleDisplay = (role) => {
    switch (role) {
        case 'FARMER':
            return { text: 'Продавець (Фермер)', color: 'text-lime-600' };
        case 'CUSTOMER':
            return { text: 'Покупець (Клієнт)', color: 'text-green-600' };
        case 'ADMIN':
            return { text: 'Адміністратор', color: 'text-red-600' };
        default:
            return { text: 'Покупець (Клієнт)', color: 'text-green-600' }; // Default to Customer
    }
};

// *********************************************************************************
// ⚠️ getRoleFromToken ТЕПЕР НЕДОЦІЛЬНА, АЛЕ НЕХАЙ ПОВЕРТАЄ CUSTOMER, ПОКИ JWT ПОРОЖНІЙ
// *********************************************************************************
const getRoleFromToken = (decodedToken) => {
    // ВАШ JWT ПОРОЖНІЙ, ТОМУ ЦЯ ЛОГІКА ЗАВЖДИ ВЕРНЕ 'CUSTOMER'
    // МИ ВИКОРИСТОВУВАТИМЕМО ДАНІ З DTO ПРОФІЛЮ ДЛЯ ВИПРАВЛЕННЯ!
    return 'CUSTOMER';
};
// *********************************************************************************

// 2. Провайдер
export const UserProvider = ({ children }) => {
    const [authData, setAuthData] = useState({ token: null, isAuthenticated: false, role: null, userId: null });
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getClient = () => getAxiosClient();

    const logout = useCallback(() => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userProfile');
        setUserProfile(null);
        setAuthData({ token: null, isAuthenticated: false, role: null, userId: null });
        toast.success('Ви успішно вийшли з акаунту.');
    }, []);

    // --- ЛОГІКА ЗАВАНТАЖЕННЯ ДАНИХ ПРОФІЛЮ (DTO) ---
    // 🔥 КЛЮЧОВА ЗМІНА: ОНОВЛЕННЯ authData РОЛЮ ПІСЛЯ ЗАПИТУ
    const fetchUserProfile = useCallback(async (token) => {
        try {
            const client = getClient();
            const decoded = jwtDecode(token);
            const userId = decoded.userId;

            const response = await client.get(`/api/users/${userId}`);
            const profileData = response.data; // profileData.role === 'FARMER' або 'CUSTOMER'

            // 1. Створюємо DTO профілю
            const finalProfile = {
                ...profileData,
                // ... (Мок-поля) ...
                bannerColor: profileData.bannerColor || '#10b981',
                cardColor: profileData.cardColor || '#ffffff',
                orders: profileData.orders || [],
                wishlist: profileData.wishlist || []
            };

            setUserProfile(finalProfile);
            localStorage.setItem('userProfile', JSON.stringify(finalProfile));

            // 2. 🔥 ОНОВЛЕННЯ authData РОЛЮ З DTO! 🔥
            setAuthData(prev => ({
                ...prev,
                role: profileData.role // <--- ВИКОРИСТОВУЄМО АКТУАЛЬНУ РОЛЬ З БАЗИ ДАНИХ
            }));


            return finalProfile;

        } catch (error) {
            console.error("Помилка завантаження профілю:", error);
        }
    }, []);


    // Функція оновлення профілю (PUT)
    const updateUserProfile = async (updatedDto) => {
        try {
            // ... (PUT логіка залишається без змін)
            const client = getClient();
            const userId = authData.userId;

            await client.put(`/api/users/${userId}`, updatedDto);

            const updatedProfile = await fetchUserProfile(authData.token);

            if (updatedProfile) {
                toast.success('Профіль оновлено успішно!');
                return true;
            } else {
                toast.warn("Профіль оновлено, але для відображення змін може знадобитися оновити сторінку.");
                return true;
            }

        } catch (error) {
            const backendMessage = error.response?.data?.message || 'Невідома помилка.';
            toast.error(`Не вдалося оновити профіль: ${backendMessage}`);
            console.error("Update profile error:", error.response || error);
            return false;
        }
    }


    // --- ПЕРЕВІРКА ТОКЕНА ПРИ СТАРТІ ---
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const profile = localStorage.getItem('userProfile');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp > currentTime) {
                    // 🔥 ВИПРАВЛЕННЯ 1: Тут встановлюємо role=CUSTOMER, оскільки в JWT її немає.
                    // Вона буде перевизначена у fetchUserProfile
                    const role = 'CUSTOMER'; // getRoleFromToken(decoded);
                    const userId = decoded.userId || null;

                    setAuthData({
                        token, isAuthenticated: true, role, userId,
                    });

                    if (profile) {
                        // Якщо профіль вже є, ми використовуємо роль із нього для первинного відображення
                        const parsedProfile = JSON.parse(profile);
                        setUserProfile(parsedProfile);
                        // Тимчасово встановлюємо роль з Local Storage DTO, поки не прийдуть свіжі дані
                        setAuthData(prev => ({ ...prev, role: parsedProfile.role }));
                    }

                    // fetchUserProfile тут оновить роль, використовуючи свіжі дані з БД
                    fetchUserProfile(token);

                } else {
                    logout();
                }
            } catch (e) {
                logout();
            }
        }
        setIsLoading(false);
    }, [logout, fetchUserProfile]);


    // --- ЛОГІКА АУТЕНТИФІКАЦІЇ ---

    // Функція входу (викликається з Auth.jsx)
    const login = (token) => {
        localStorage.setItem('jwtToken', token);
        const decoded = jwtDecode(token);

        // 🔥 ВИПРАВЛЕННЯ 2: Тут також встановлюємо role=CUSTOMER
        const role = 'CUSTOMER'; // getRoleFromToken(decoded);
        const userId = decoded.userId || null;

        setAuthData({
            token, isAuthenticated: true, role, userId,
        });

        // fetchUserProfile оновить authData.role
        fetchUserProfile(token)
            .then(profile => {
                if(profile) {
                    toast.success(`Вітаємо! Ваша роль: ${getRoleDisplay(profile.role).text}`);
                }
            });
    };

    // Допоміжна функція для перевірки ролі
    const hasRole = (roles) => {
        if (isLoading || !authData.isAuthenticated) return false;
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        return requiredRoles.includes(authData.role);
    }

    // ... (решта коду залишається без змін)

    const toggleWishlist = async (product) => {
        if (!authData.isAuthenticated) {
            toast.error("Увійдіть, щоб додати в обране");
            return;
        }

        const productId = product.productId || product.id; // Страховка ID

        try {
            // 1. Викликаємо наш новий "Toggle" ендпоінт
            const response = await getAxiosClient().post(`/api/wishlist/toggle/${productId}`);

            // 2. Оновлюємо локальний стан інтерфейсу без перезавантаження сторінки
            if (response.data === 'ADDED') {
                toast.success("Додано в обране ❤️");
                // Додаємо товар в локальний список
                setUserProfile(prev => ({
                    ...prev,
                    wishlist: [...(prev.wishlist || []), product]
                }));
            } else {
                toast.success("Видалено з обраного 💔");
                // Видаляємо товар з локального списку
                setUserProfile(prev => ({
                    ...prev,
                    wishlist: (prev.wishlist || []).filter(item => item.productId !== productId)
                }));
            }

        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error("Помилка оновлення списку бажань");
        }
    };

    const addOrderToHistory = (orderData) => {
        if (!authData.isAuthenticated) return;
        toast.error("Замовлення збережено (МОК API)");
    };

    const clearOrderHistory = () => {
        if (window.confirm("Видалити всю історію замовлень?")) {
            toast.error('Історія очищена (МОК API)');
        }
    };

    const deleteOrder = (orderId) => {
        toast.error('Замовлення видалено (МОК API)');
    };


    return (
        <UserContext.Provider value={{
            user: userProfile,
            authData,
            isLoading,
            login,
            logout,
            hasRole,
            fetchUserProfile,
            updateUserProfile,
            toggleWishlist,
            addOrderToHistory,
            clearOrderHistory,
            deleteOrder,
        }}>
            {children}
        </UserContext.Provider>
    );
};

// 3. Хук
export const useUser = () => useContext(UserContext);