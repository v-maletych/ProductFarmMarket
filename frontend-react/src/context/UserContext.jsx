import React, {createContext, useState, useContext, useEffect, useCallback} from 'react';
import toast from 'react-hot-toast';
import {jwtDecode} from 'jwt-decode';
import {getAxiosClient} from '../api/axiosClient';
import baseClient from '../api/axiosClient';
import {Navigate} from 'react-router-dom';

const UserContext = createContext();

const getRoleDisplay = (role) => {
    switch (role) {
        case 'FARMER':
            return {text: 'Продавець (Фермер)', color: 'text-lime-600'};
        case 'CUSTOMER':
            return {text: 'Покупець (Клієнт)', color: 'text-green-600'};
        case 'ADMIN':
            return {text: 'Адміністратор', color: 'text-red-600'};
        default:
            return {text: 'Покупець (Клієнт)', color: 'text-green-600'};
    }
};
const getRoleFromToken = (decodedToken) => {
    return 'CUSTOMER';
};
export const UserProvider = ({children}) => {
    const [authData, setAuthData] = useState({token: null, isAuthenticated: false, role: null, userId: null});
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getClient = () => getAxiosClient();

    const logout = useCallback(() => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userProfile');
        setUserProfile(null);
        setAuthData({token: null, isAuthenticated: false, role: null, userId: null});
        toast.success('Ви успішно вийшли з акаунту.');
    }, []);
    const fetchUserProfile = useCallback(async (token) => {
        try {
            const client = getClient();
            const decoded = jwtDecode(token);
            const userId = decoded.userId;

            const response = await client.get(`/api/users/${userId}`);
            const profileData = response.data;
            const finalProfile = {
                ...profileData,
                bannerColor: profileData.bannerColor || '#10b981',
                cardColor: profileData.cardColor || '#ffffff',
                orders: profileData.orders || [],
                wishlist: profileData.wishlist || []
            };

            setUserProfile(finalProfile);
            localStorage.setItem('userProfile', JSON.stringify(finalProfile));
            setAuthData(prev => ({
                ...prev,
                role: profileData.role
            }));


            return finalProfile;

        } catch (error) {
            console.error("Помилка завантаження профілю:", error);
        }
    }, []);
    const updateUserProfile = async (updatedDto) => {
        try {
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
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        const profile = localStorage.getItem('userProfile');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp > currentTime) {
                    const role = 'CUSTOMER';
                    const userId = decoded.userId || null;

                    setAuthData({
                        token, isAuthenticated: true, role, userId,
                    });

                    if (profile) {
                        const parsedProfile = JSON.parse(profile);
                        setUserProfile(parsedProfile);
                        setAuthData(prev => ({...prev, role: parsedProfile.role}));
                    }
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
    const login = (token) => {
        localStorage.setItem('jwtToken', token);
        const decoded = jwtDecode(token);
        const role = 'CUSTOMER';
        const userId = decoded.userId || null;

        setAuthData({
            token, isAuthenticated: true, role, userId,
        });

        fetchUserProfile(token)
            .then(profile => {
                if (profile) {
                    toast.success(`Вітаємо! Ваша роль: ${getRoleDisplay(profile.role).text}`);
                }
            });
    };

    const hasRole = (roles) => {
        if (isLoading || !authData.isAuthenticated) return false;
        const requiredRoles = Array.isArray(roles) ? roles : [roles];
        return requiredRoles.includes(authData.role);
    }
    const toggleWishlist = async (product) => {
        if (!authData.isAuthenticated) {
            toast.error("Увійдіть, щоб додати в обране");
            return;
        }

        const productId = product.productId || product.id;

        try {
            const response = await getAxiosClient().post(`/api/wishlist/toggle/${productId}`);
            if (response.data === 'ADDED') {
                toast.success("Додано в обране ❤️");
                setUserProfile(prev => ({
                    ...prev,
                    wishlist: [...(prev.wishlist || []), product]
                }));
            } else {
                toast.success("Видалено з обраного 💔");
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

export const useUser = () => useContext(UserContext);