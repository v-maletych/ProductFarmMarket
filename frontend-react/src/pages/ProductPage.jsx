import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { getAxiosClient } from '../api/axiosClient';
import toast from 'react-hot-toast';

// -----------------------------------------------------------
// 💡 КОМПОНЕНТИ-УТИЛІТИ
// -----------------------------------------------------------

const StarRatingDisplay = ({ rating, size = 18 }) => {
    // Обробка рейтингу, якщо він приходить як об'єкт ENUM або число
    let normalizedRating = 0;
    if (typeof rating === 'number') {
        normalizedRating = rating;
    } else if (rating === 'FIVE') normalizedRating = 5;
    else if (rating === 'FOUR') normalizedRating = 4;
    else if (rating === 'THREE') normalizedRating = 3;
    else if (rating === 'TWO') normalizedRating = 2;
    else if (rating === 'ONE') normalizedRating = 1;

    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const starIndex = index + 1;
                let color = "#e4e5e9";
                if (starIndex <= normalizedRating) {
                    color = "#ffc107";
                }
                return (
                    <FaStar
                        key={index}
                        color={color}
                        size={size}
                        className="mr-0.5"
                    />
                );
            })}
        </div>
    );
};

const calculateAvgRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
        return { avgRating: 0, count: 0 };
    }
    const total = reviews.reduce((sum, review) => {
        let val = 0;
        // Конвертація ENUM в число для підрахунку
        if (typeof review.raiting === 'number') val = review.raiting;
        else if (review.raiting === 'FIVE') val = 5;
        else if (review.raiting === 'FOUR') val = 4;
        else if (review.raiting === 'THREE') val = 3;
        else if (review.raiting === 'TWO') val = 2;
        else if (review.raiting === 'ONE') val = 1;
        return sum + val;
    }, 0);

    const avgRating = (total / reviews.length).toFixed(1);
    return { avgRating: parseFloat(avgRating), count: reviews.length };
};

// -----------------------------------------------------------
// 💡 ОСНОВНИЙ КОМПОНЕНТ ProductPage
// -----------------------------------------------------------
const ProductPage = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { authData } = useUser();
    const client = getAxiosClient();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newReview, setNewReview] = useState({ raitingValue: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);


    // --- ЗАВАНТАЖЕННЯ ДАНИХ ---
    const fetchProductAndReviews = useCallback(async () => {
        if (!productId) return;

        setIsLoading(true);
        setError(null);

        try {
            // 1. Завантаження продукту (ДОДАНО /api)
            const productRes = await client.get(`/api/products/${productId}`);
            setProduct(productRes.data);

            // 2. Завантаження відгуків (ДОДАНО /api)
            // Оскільки у нас немає окремого методу пошуку по ID продукту на бекенді,
            // ми завантажуємо всі і фільтруємо тут (це стабільне рішення для поточного бекенду)
            const reviewsRes = await client.get('/api/reviews');

            // Фільтруємо відгуки саме для цього товару
            const filteredReviews = reviewsRes.data.filter(r =>
                r.product?.productId === parseInt(productId) || r.product?.id === parseInt(productId)
            );
            setReviews(filteredReviews);

        } catch (err) {
            setError("Не вдалося завантажити дані товару.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [productId]); // client видалено з залежностей, щоб уникнути циклів

    useEffect(() => {
        fetchProductAndReviews();
    }, [fetchProductAndReviews]);


    // --- ВІДПРАВКА ВІДГУКУ ---
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!authData.isAuthenticated) {
            toast.error('Увійдіть, щоб залишити відгук');
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        if (!newReview.comment.trim()) {
            toast.error('Будь ласка, напишіть коментар.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Конвертуємо число в ENUM для бекенду
            const ratingEnum =
                newReview.raitingValue === 5 ? 'FIVE' :
                    newReview.raitingValue === 4 ? 'FOUR' :
                        newReview.raitingValue === 3 ? 'THREE' :
                            newReview.raitingValue === 2 ? 'TWO' : 'ONE';

            const reviewData = {
                product: { productId: productId }, // Важливо: об'єкт product
                raiting: ratingEnum,
                comment: newReview.comment,
            };

            // ДОДАНО /api
            await client.post('/api/reviews', reviewData);

            await fetchProductAndReviews(); // Оновлюємо список

            setNewReview({ raitingValue: 5, comment: '' });
            toast.success('Відгук успішно додано!');

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Не вдалося додати відгук.';
            toast.error(`Помилка: ${errorMessage}`);
            console.error("Review submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 inline-block"></div>
                <p className="mt-4 text-gray-600">Завантаження товару...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-600">{error || "Товар не знайдено 😕"}</h2>
                <button onClick={() => navigate('/products')} className="mt-4 text-green-600 underline">Повернутися в каталог</button>
            </div>
        );
    }

    const { avgRating, count: reviewCount } = calculateAvgRating(reviews);

    return (
        <div className="container mx-auto px-4 py-10">
            <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-green-600 flex items-center gap-2 transition">← Назад</button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                {/* 1. Зображення */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 border border-gray-100">
                    <img src={product.image || 'https://placehold.co/800x600'} alt={product.name} className="w-full h-auto object-cover rounded-xl transform hover:scale-105 transition duration-500" />
                </div>

                {/* 2. Деталі продукту */}
                <div className="flex flex-col justify-center">
                    <span className="text-green-600 font-bold text-sm tracking-wider uppercase mb-2">{product.category?.name || 'Продукти'}</span>
                    <h1 className="text-4xl font-black text-gray-800 mb-4">{product.name}</h1>
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description || 'Опис відсутній.'}</p>

                    <div className="flex items-center gap-6 mb-8">
                        <span className="text-4xl font-bold text-gray-900">{product.price?.toFixed(2) || '0.00'} грн</span>
                        <span className="text-gray-500 text-xl">/ {product.unit || 'кг'}</span>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => addToCart(product)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:-translate-y-1 flex justify-center items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Додати в кошик
                        </button>
                    </div>

                    {/* Рейтинг */}
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <span className="block font-bold text-green-700">Оцінка</span>
                            <div className="flex justify-center"><StarRatingDisplay rating={avgRating} size={16} /></div>
                            <span className="text-xs text-green-600">{avgRating.toFixed(1)}</span>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <span className="block font-bold text-green-700">{reviewCount}</span>
                            <span className="text-xs text-green-600">Відгуків</span>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <span className="block font-bold text-green-700">Швидка</span>
                            <span className="text-xs text-green-600">Доставка</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Секція відгуків */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Відгуки покупців ({reviewCount})</h3>

                {authData.isAuthenticated ? (
                    <div className="mb-10 bg-gray-50 p-6 rounded-xl">
                        <h4 className="font-bold text-gray-700 mb-4">Залишити відгук</h4>
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4 flex items-center">
                                <span className="text-sm text-gray-500 mr-3">Ваша оцінка:</span>
                                {[5, 4, 3, 2, 1].map(r => (
                                    <label key={r} className="inline-flex items-center mr-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="raiting"
                                            value={r}
                                            checked={newReview.raitingValue === r}
                                            onChange={() => setNewReview({...newReview, raitingValue: r})}
                                            className="hidden"
                                        />
                                        <div className={`flex items-center p-1 rounded ${newReview.raitingValue === r ? 'bg-yellow-100 ring-1 ring-yellow-400' : ''}`}>
                                            <StarRatingDisplay rating={r} size={18} />
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <textarea
                                placeholder="Напишіть ваші враження..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-green-500 outline-none resize-none mb-4"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !newReview.comment.trim()}
                                className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
                            >
                                {isSubmitting ? 'Надсилання...' : 'Надіслати відгук'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="mb-10 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
                        Будь ласка, <button onClick={() => navigate('/login', { state: { from: `/product/${productId}` } })} className="font-semibold underline hover:text-yellow-900">увійдіть</button>, щоб залишити відгук.
                    </div>
                )}

                <div className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.reviewId || Math.random()} className="border-b border-gray-100 pb-6 last:border-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-lg uppercase">
                                            {review.user?.firstName?.charAt(0) || 'А'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{review.user?.firstName || 'Анонім'} {review.user?.lastName}</p>
                                            <StarRatingDisplay rating={review.raiting} size={14} />
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('uk-UA') : ''}
                                    </span>
                                </div>
                                <p className="text-gray-600 pl-14">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center py-4">Ще немає відгуків. Будьте першим!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;