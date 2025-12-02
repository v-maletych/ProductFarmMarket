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
        setLoadingData(true);
        setErrorData(null);
        try {
            // ВИПРАВЛЕНО: Додано префікс /api
            const productsRes = await client.get('/api/products');

            // ВИПРАВЛЕНО: Додано префікс /api
            const categoriesRes = await client.get('/api/categories');

            setProducts(productsRes.data || []);
            setCategories(categoriesRes.data || []);

            toast.success("Дані каталогу завантажено.");

        } catch (err) {
            setErrorData("Не вдалося завантажити товари та категорії з API.");
            console.error("Market data fetch error:", err);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchMarketData();
    }, []);

    const subcategoryTranslations = {
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
            fetchMarketData
        }}>
            {children}
        </MarketDataContext.Provider>
    );
};

export const useMarketData = () => useContext(MarketDataContext);