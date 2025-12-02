import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { getAxiosClient } from '../api/axiosClient';
import baseClient from '../api/axiosClient';
import { Navigate } from 'react-router-dom';

// 1. Створюємо контекст
const UserContext = createContext();

// 2. Провайдер
export const UserProvider = ({ children }) => {
    // authData зберігає JWT, роль та ID
    const [authData, setAuthData] = useState({ token: null, isAuthenticated: false, role: null, userId: null });
    // userProfile зберігає DTO користувача (FirstName, phone, address, etc.)
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Функція для запитів до захищених ендпоінтів
    const getClient = () => getAxiosClient();

    // 3. Логіка виходу
    const logout = useCallback(() => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userProfile');
        setUserProfile(null);
        setAuthData({ token: null, isAuthenticated: false, role: null, userId: null });
        toast.success('Ви успішно вийшли з акаунту.');
    }, []);

    // --- ЛОГІКА ЗАВАНТАЖЕННЯ ДАНИХ ПРОФІЛЮ (DTO) ---
    // **********************************************
    // 💡 КРИТИЧНЕ ВИПРАВЛЕННЯ: Ізолюємо logout, щоб він не спрацьовував при кожній помилці 500/403
    // **********************************************
    const fetchUserProfile = useCallback(async (token) => {
        // У цьому місці ми НЕ викликаємо logout(), щоб не потрапити у цикл
        // (logout викликається тільки в перехоплювачі Axios)
        try {
            const client = getClient();
            const decoded = jwtDecode(token);
            const userId = decoded.userId;

            // GET /api/users/{userId} - Захищений ендпоінт
            const response = await client.get(`/api/users/${userId}`);

            const profileData = response.data;

            const finalProfile = {
                ...profileData,
                // Мок-поля:
                bannerColor: profileData.bannerColor || '#10b981',
                cardColor: profileData.cardColor || '#ffffff',
                orders: profileData.orders || [],
                wishlist: profileData.wishlist || []
            };

            setUserProfile(finalProfile);
            localStorage.setItem('userProfile', JSON.stringify(finalProfile));

            return finalProfile;

        } catch (error) {
            console.error("Помилка завантаження профілю:", error);
            // Видалено: logout(); // 🛑 Тепер logout() відбувається в axiosClient.js interceptor
        }
    }, []); // Тепер немає залежності від logout, оскільки ми його не викликаємо тут


    // Функція оновлення профілю (PUT)
    const updateUserProfile = async (updatedDto) => {
        try {
            const client = getClient();
            const userId = authData.userId;

            // PUT /api/users/{userId}
            await client.put(`/api/users/${userId}`, updatedDto);

            // **********************************************
            // ✅ КРИТИЧНЕ ВИПРАВЛЕННЯ: ВИКОНАЙТЕ АВТОМАТИЧНЕ ОНОВЛЕННЯ КОНТЕКСТУ
            // **********************************************

            // Якщо PUT успішний, ми ЗНОВУ завантажуємо профіль.
            // Ми ізолюємо цей виклик, щоб він не викликав помилку в catch блоці нижче
            // і не маскував успіх PUT-запиту.
            const updatedProfile = await fetchUserProfile(authData.token);

            if (updatedProfile) {
                toast.success('Профіль оновлено успішно!');
                return true;
            } else {
                // Якщо PUT був успішним, але fetchUserProfile провалився
                toast.warn("Профіль оновлено, але для відображення змін може знадобитися оновити сторінку.");
                return true; // Вважаємо успіхом, оскільки дані оновлено
            }

        } catch (error) {
            // ЦЕЙ БЛОК ВИКОНУЄТЬСЯ, ЯКЩО САМ PUT-ЗАПИТ ПРОВАЛИТЬСЯ (400, 403, 500)
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
                    const role = decoded.authorities ? decoded.authorities[0].authority : 'CUSTOMER';
                    const userId = decoded.userId || null;

                    setAuthData({
                        token, isAuthenticated: true, role, userId,
                    });

                    if (profile) {
                        setUserProfile(JSON.parse(profile));
                    }

                    // Завантажуємо свіжі дані при кожному запуску (завжди)
                    fetchUserProfile(token);

                } else {
                    logout();
                }
            } catch (e) {
                // Якщо токен недійсний або пошкоджений
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

        const role = decoded.authorities ? decoded.authorities[0].authority : 'CUSTOMER';
        const userId = decoded.userId || null;

        setAuthData({
            token, isAuthenticated: true, role, userId,
        });

        // Запускаємо завантаження профілю
        fetchUserProfile(token);
        toast.success(`Вітаємо! Ваша роль: ${role}`);
    };

    // Допоміжна функція для перевірки ролі
    const hasRole = (roles) => {
        if (isLoading || !authData.isAuthenticated) return false;
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        return requiredRoles.includes(authData.role);
    }

    // --- ЛОГІКА WISHLIST, ORDERS (API MOCK) ---

    const toggleWishlist = async (product) => {
        if (!authData.isAuthenticated) {
            toast.error("Увійдіть, щоб додати в обране");
            return;
        }
        toast("Логіка API Wishlist працює (MOCK)", { icon: '❤️' });
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
            fetchUserProfile, // Тепер експортуємо для використання поза контекстом, якщо потрібно
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