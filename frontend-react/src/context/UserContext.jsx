import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import jwtDecode from 'jwt-decode';
import { getAxiosClient, baseClient } from '../api/axiosClient';

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

    // --- ЛОГІКА ЗАВАНТАЖЕННЯ ДАНИХ ПРОФІЛЮ (DTO) ---

    // Функція для завантаження User DTO (профілю)
    const fetchUserProfile = async (token) => {
        try {
            const client = getClient();
            const decoded = jwtDecode(token);
            const userId = decoded.userId; // Припускаємо, що ви додали userId в JWT клейми

            // GET /api/users/{userId} - Захищений ендпоінт
            const response = await client.get(`/users/${userId}`);

            const profileData = response.data;

            // УВАГА: Ми об'єднуємо DTO з мок-даними UI (bannerColor, etc.), оскільки їх немає в БД
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
            // Якщо не вдалося завантажити профіль, робимо вихід
            logout();
        }
    };

    // 3. Логіка виходу (включає logout з AuthContext)
    const logout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userProfile');
        setUserProfile(null);
        setAuthData({ token: null, isAuthenticated: false, role: null, userId: null });
        toast.success('Ви успішно вийшли з акаунту');
    };

    // Функція оновлення профілю (PUT) - викликається з Profile.jsx
    const updateUserProfile = async (updatedDto) => {
        try {
            const client = getClient();
            const userId = authData.userId;

            // PUT /api/users/{userId}
            await client.put(`/users/${userId}`, updatedDto);

            // Оновлюємо локальний стейт, завантажуючи DTO заново
            await fetchUserProfile(authData.token);

            toast.success('Профіль оновлено успішно!');
            return true;

        } catch (error) {
            toast.error("Не вдалося оновити профіль. Перевірте дані.");
            console.error("Update profile error:", error);
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
                    } else {
                        fetchUserProfile(token);
                    }
                } else {
                    logout();
                }
            } catch (e) {
                logout();
            }
        }
        setIsLoading(false);
    }, []);

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

        // Запускаємо завантаження профілю DTO
        fetchUserProfile(token);
        toast.success(`Вітаємо! Ваша роль: ${role}`); // Тост про успішний вхід
    };

    // Допоміжна функція для перевірки ролі
    const hasRole = (roles) => {
        if (isLoading || !authData.isAuthenticated) return false;
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        return requiredRoles.includes(authData.role);
    }

    // --- ЛОГІКА WISHLIST, ORDERS (API MOCK) ---

    // Логіка додавання/видалення з Wishlist
    const toggleWishlist = async (product) => {
        if (!authData.isAuthenticated) {
            toast.error("Увійдіть, щоб додати в обране");
            return;
        }

        // Тут має бути логіка API, яка звертається до /api/wishlist
        toast("Логіка API Wishlist працює (MOCK)", { icon: '❤️' });
    };

    // Логіка замовлень (POST)
    const addOrderToHistory = (orderData) => {
        if (!authData.isAuthenticated) return;
        // Тут має бути POST /api/orders
        toast.error("Замовлення збережено (МОК API)");
    };

    // Логіка очищення історії
    const clearOrderHistory = () => {
        if (window.confirm("Видалити всю історію замовлень?")) {
            // Тут має бути DELETE /api/orders/user/{userId}
            toast.error('Історія очищена (МОК API)');
        }
    };

    // Логіка видалення одного замовлення
    const deleteOrder = (orderId) => {
        // Тут має бути DELETE /api/orders/{orderId}
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