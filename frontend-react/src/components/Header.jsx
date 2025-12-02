import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAxiosClient } from '../api/axiosClient';
import { toast } from 'react-hot-toast';

const MarketDataContext = createContext();

export const MarketDataProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [errorData, setErrorData] = useState(null);
    const client = getAxiosClient();

    // 1. Функція завантаження публічних даних
    const fetchMarketData = async () => {
        try {
            // Оскільки це публічні ендпоїнти, вони не вимагають токена, але краще використовувати
            // наш налаштований client для обробки помилок мережі.
            const [productsRes, categoriesRes] = await Promise.all([
                client.get('/products'),
                client.get('/categories')
            ]);

            setProducts(productsRes.data || []);
            setCategories(categoriesRes.data || []);
            setErrorData(null);

        } catch (err) {
            setErrorData("Не вдалося завантажити дані каталогу. Перевірте з'єднання.");
            toast.error("Помилка завантаження каталогу!");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchMarketData();
    }, []);

    // 2. Словник підкатегорій (мок, доки не буде реалізовано на бекенді)
    const subcategoryTranslations = {
        // ... (Тут можна залишити мок-переклади)
        apples: "🍎 Яблука", tomatoes: "🍅 Томати", meat: "🥩 М'ясо", eggs: "🥚 Яйця",
        all: "📦 Всі товари"
    };

    return (
        <MarketDataContext.Provider value={{
            products,
            categories,
            subcategoryTranslations,
            loadingData,
            errorData,
            fetchMarketData // Для примусового оновлення, якщо потрібно
        }}>
            {children}
        </MarketDataContext.Provider>
    );
};

export const useMarketData = () => useContext(MarketDataContext);