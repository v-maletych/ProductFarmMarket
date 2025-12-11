import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { getAxiosClient } from '../api/axiosClient';
import toast from 'react-hot-toast';

// Використовуйте цей базовий URL, якщо він не встановлений у getAxiosClient
const API_BASE_URL = 'http://localhost:8080/api/v1'; 

// -----------------------------------------------------------
// 💡 КОМПОНЕНТИ-УТИЛІТИ (Винесені для чистоти)
// -----------------------------------------------------------

// Компонент для відображення зірочок
const StarRatingDisplay = ({ rating, size = 18 }) => {
    // Якщо рейтинг є об'єктом (з бекенду), беремо його числове значення
    const ratingValue = rating && typeof rating === 'object' ? rating.value : rating;
    const normalizedRating = parseFloat(ratingValue) || 0;

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

// -----------------------------------------------------------
// 💡 ФУНКЦІЯ ОБЧИСЛЕННЯ СЕРЕДНЬОГО РЕЙТИНГУ
// -----------------------------------------------------------
const calculateAvgRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
        return { avgRating: 0, count: 0 };
    }
    // review.raiting тут може бути або числом (якщо помилка в DTO), або об'єктом {name: 'FIVE', value: 5}
    const total = reviews.reduce((sum, review) => {
        // Забезпечуємо, що ми беремо числове значення
        const ratingValue = review.raiting && typeof review.raiting === 'object' 
                            ? review.raiting.value 
                            : review.raiting; 
        return sum + (ratingValue || 0); // Додаємо 0, якщо значення відсутнє
    }, 0); 
    
    const avgRating = (total / reviews.length).toFixed(1);
    return { avgRating: parseFloat(avgRating), count: reviews.length };
};


// -----------------------------------------------------------
// 💡 ОСНОВНИЙ КОМПОНЕНТ ProductPage
// -----------------------------------------------------------
const ProductPage = () => {
    const { id: productId } = useParams(); // Перейменовуємо для ясності
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { authData } = useUser();
    const client = getAxiosClient();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Стан для форми відгуку (використовуємо числове значення)
    const [newReview, setNewReview] = useState({ raitingValue: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    // --- ЗАВАНТАЖЕННЯ ДАНИХ (ПРОДУКТ ТА ВІДГУКИ) ---
    const fetchProductAndReviews = useCallback(async () => {
        if (!productId) return;
        
        setIsLoading(true);
        setError(null);
        
        // 1. Завантаження продукту
        try {
            // ВИПРАВЛЕНО: Використовуємо /api/v1/products для бекенду
            const productRes = await client.get(`/products/${productId}`); 
            setProduct(productRes.data);

            // 2. Завантаження відгуків для конкретного продукту
            // ВИПРАВЛЕНО: Використовуємо правильний endpoint /reviews/product/{id}
            const reviewsRes = await client.get(`/reviews/product/${productId}`);
            setReviews(reviewsRes.data);

        } catch (err) {
            setError("Не вдалося завантажити дані товару.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
        // Залежність тільки від productId і client, client не змінюється.
    }, [productId, client]);


    useEffect(() => {
        fetchProductAndReviews();
    }, [fetchProductAndReviews]); // useEffect тепер викликається коректно


    // --- ВІДПРАВКА ВІДГУКУ ---
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!authData.isAuthenticated) {
            toast.error('Увійдіть, щоб залишити відгук');
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }
        
        if (!newReview.comment.trim() || newReview.raitingValue < 1 || newReview.raitingValue > 5) {
             toast.error('Будь ласка, оберіть рейтинг та залиште коментар.');
             return;
        }

        setIsSubmitting(true);

        try {
            // DTO для бекенду: productId, raitingValue, comment
            const reviewData = {
                productId: productId,
                raitingValue: newReview.raitingValue,
                comment: newReview.comment,
            };

            // ВИПРАВЛЕНО: Правильний endpoint для відправки
            await client.post('/reviews', reviewData); 

            // Перезавантажуємо відгуки, щоб оновити список та середній рейтинг
            await fetchProductAndReviews();

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

    // -----------------------------------------------------------
    // 3. РЕНДЕРИНГ
    // -----------------------------------------------------------

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
                            {/* SVG кошика */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Додати в кошик
                        </button>
                    </div>
                    
                    {/* Середній рейтинг та відгуки */}
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <span className="block font-bold text-green-700">Оцінка</span>
                            <StarRatingDisplay rating={avgRating} size={16} />
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

                {/* Форма відгуку (Інтегрована) */}
                {authData.isAuthenticated ? (
                    <div className="mb-10 bg-gray-50 p-6 rounded-xl">
                        <h4 className="font-bold text-gray-700 mb-4">Залишити відгук</h4>
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <span className="text-sm text-gray-500 mr-3">Ваша оцінка:</span>
                                {/* Використовуємо зірочки для форми, як це було у вашому початковому плані */}
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
                                        <StarRatingDisplay 
                                            rating={r} 
                                            size={18} 
                                            className="inline-block"
                                        />
                                        {/* Додатковий візуальний індикатор, коли обрано */}
                                        {newReview.raitingValue === r && <span className="text-green-600 text-xs ml-1 font-semibold"> (Обрано)</span>}
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

                {/* Список відгуків */}
                <div className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            // Використовуємо review.id як ключ, припускаючи, що бекенд повертає його
                            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-lg uppercase">
                                            {review.userName?.charAt(0) || 'А'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{review.userName || 'Анонім'}</p>
                                            {/* Використовуємо review.raiting, яке є об'єктом {name, value} */}
                                            <StarRatingDisplay rating={review.raiting} size={16} /> 
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString('uk-UA') : 'Дата невідома'}
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