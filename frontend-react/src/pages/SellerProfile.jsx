import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAxiosClient } from '../api/axiosClient';
import ProductCard from '../components/ProductCard';
import { FaStar } from 'react-icons/fa';

const SellerProfile = () => {
    const { id } = useParams(); // ID продавця з URL
    const client = getAxiosClient();

    const [sellerProducts, setSellerProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [sellerInfo, setSellerInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Отримуємо товари цього продавця
                const productsRes = await client.get(`/api/products/seller/${id}`);
                setSellerProducts(productsRes.data);

                // 2. Отримуємо відгуки про цього продавця
                const reviewsRes = await client.get(`/api/reviews/seller/${id}`);
                setReviews(reviewsRes.data);

                // 3. Отримуємо інфо про продавця (беремо з першого товару, якщо є, або окремим запитом)
                if (productsRes.data.length > 0) {
                    setSellerInfo({
                        name: productsRes.data[0].ownerName,
                        id: productsRes.data[0].ownerId
                    });
                } else {
                    // Якщо товарів немає, спробуємо отримати юзера (потрібен ендпоінт, або просто покажемо ID)
                    const userRes = await client.get(`/api/users/${id}`);
                    setSellerInfo({
                        name: `${userRes.data.firstName} ${userRes.data.lastName}`,
                        id: userRes.data.userId
                    });
                }

            } catch (error) {
                console.error("Error fetching seller data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Розрахунок рейтингу
    const calculateRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, r) => {
            const val = r.raiting === 'FIVE' ? 5 : r.raiting === 'FOUR' ? 4 : r.raiting === 'THREE' ? 3 : r.raiting === 'TWO' ? 2 : 1;
            return sum + val;
        }, 0);
        return (total / reviews.length).toFixed(1);
    };

    const rating = calculateRating();

    if (isLoading) return <div className="text-center py-20">Завантаження профілю продавця...</div>;

    return (
        <div className="container mx-auto px-4 py-10">
            {/* Шапка профілю */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-10 border border-green-100 flex flex-col md:flex-row items-center gap-8">
                {/* Аватар */}
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-4xl font-bold text-green-600 border-4 border-white shadow">
                    {sellerInfo?.name?.charAt(0) || 'F'}
                </div>

                <div className="text-center md:text-left">
                    <span className="text-green-600 font-bold uppercase tracking-widest text-xs">Продавець</span>
                    <h1 className="text-4xl font-black text-gray-800 mb-2">{sellerInfo?.name || 'Фермер'}</h1>

                    {/* Рейтинг */}
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                        <div className="flex text-yellow-400 text-xl">
                            <FaStar />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{rating}</span>
                        <span className="text-gray-500">({reviews.length} відгуків)</span>
                    </div>

                    <p className="text-gray-600 max-w-lg">
                        Цей продавець пропонує свіжі фермерські продукти. Перегляньте асортимент нижче та підтримайте українського виробника!
                    </p>
                </div>
            </div>

            {/* Товари продавця */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Всі товари продавця ({sellerProducts.length})</h2>

            {sellerProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sellerProducts.map(product => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <p className="text-gray-400">У цього продавця наразі немає активних товарів.</p>
                </div>
            )}
        </div>
    );
};

export default SellerProfile;