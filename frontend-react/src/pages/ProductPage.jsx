import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { getAxiosClient } from '../api/axiosClient';
import toast from 'react-hot-toast';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { authData } = useUser();
    const client = getAxiosClient();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);


    // -----------------------------------------------------------
    // 1. ФУНКЦІЯ ЗАВАНТАЖЕННЯ ДАНИХ (ПРОДУКТ ТА ВІДГУКИ)
    // -----------------------------------------------------------
    const fetchProductAndReviews = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // ... (використовуємо client тут) ...
            const productRes = await client.get(`/api/products/${id}`);
            setProduct(productRes.data);

            const reviewsRes = await client.get('/api/reviews');

            const filteredReviews = reviewsRes.data.filter(r => r.product?.productId === productRes.data.productId);
            setReviews(filteredReviews);

        } catch (err) {
            setError("Не вдалося завантажити дані товару.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
        // 🔥 РІШЕННЯ 2: ВИДАЛИТИ "client" З МАСИВУ ЗАЛЕЖНОСТЕЙ! 🔥
    }, [id]);


    useEffect(() => {
        if (id) {
            fetchProductAndReviews();
        }
        // "fetchProductAndReviews" тепер не змінюється, і цикл зупиняється.
    }, [fetchProductAndReviews, id]);

    // -----------------------------------------------------------
    // 2. ФУНКЦІЯ ВІДПРАВКИ ВІДГУКУ (API POST-ЗАХИЩЕНИЙ)
    // -----------------------------------------------------------
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!authData.isAuthenticated) {
            toast.error('Увійдіть, щоб залишити відгук');
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }
        if (!newReview.comment.trim()) return;

        setIsSubmitting(true);

        try {
            const reviewData = {
                raiting: newReview.rating === 5 ? 'FIVE' :
                    newReview.rating === 4 ? 'FOUR' :
                        newReview.rating === 3 ? 'THREE' :
                            newReview.rating === 2 ? 'TWO' : 'ONE',
                comment: newReview.comment,
                product: { productId: product.productId },
            };

            // ВИПРАВЛЕНО: Додано префікс /api
            await client.post('/api/reviews', reviewData);

            await fetchProductAndReviews();

            setNewReview({ rating: 5, comment: '' });
            toast.success('Відгук успішно додано!');

        } catch (err) {
            toast.error(`Помилка: Не вдалося додати відгук. ${err.response?.data?.message || ''}`);
            console.error("Review submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // -----------------------------------------------------------
    // 3. РЕНДЕРИНГ
    // -----------------------------------------------------------

    if (isLoading) {
        return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 inline-block"></div><p className="mt-4 text-gray-600">Завантаження товару...</p></div>;
    }

    if (!product) {
        return <div className="text-center py-20"><h2 className="text-2xl font-bold">Товар не знайдено 😕</h2><button onClick={() => navigate('/products')} className="mt-4 text-green-600 underline">Повернутися в каталог</button></div>;
    }

    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.raiting, 0) / reviews.length
        : 0;


    return (
        <div className="container mx-auto px-4 py-10">
            <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-green-600 flex items-center gap-2 transition">← Назад</button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 border border-gray-100">
                    <img src={product.image || 'https://placehold.co/800x600'} alt={product.name} className="w-full h-auto object-cover rounded-xl transform hover:scale-105 transition duration-500" />
                </div>

                <div className="flex flex-col justify-center">
                    <span className="text-green-600 font-bold text-sm tracking-wider uppercase mb-2">{product.category?.name || 'Продукти'}</span>
                    <h1 className="text-4xl font-black text-gray-800 mb-4">{product.name}</h1>
                    <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description || 'Опис відсутній.'}</p>
                    <div className="flex items-center gap-6 mb-8">
                        <span className="text-4xl font-bold text-gray-900">{product.price?.toFixed(2)} грн</span>
                        <span className="text-gray-500 text-xl">/ {product.unit || 'кг'}</span>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => addToCart(product)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:-translate-y-1 flex justify-center items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            Додати в кошик
                        </button>
                    </div>
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-green-50 rounded-lg"><span className="block font-bold text-green-700">Середня</span><span className="text-xs text-green-600">Оцінка: {averageRating.toFixed(1)}</span></div>
                        <div className="p-3 bg-green-50 rounded-lg"><span className="block font-bold text-green-700">{reviews.length}</span><span className="text-xs text-green-600">Відгуків</span></div>
                        <div className="p-3 bg-green-50 rounded-lg"><span className="block font-bold text-green-700">Швидка</span><span className="text-xs text-green-600">Доставка</span></div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Відгуки покупців ({reviews.length})</h3>

                {/* Форма */}
                {authData.isAuthenticated && (
                    <div className="mb-10 bg-gray-50 p-6 rounded-xl">
                        <h4 className="font-bold text-gray-700 mb-4">Залишити відгук</h4>
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <span className="text-sm text-gray-500 mr-3">Ваша оцінка:</span>
                                <select
                                    value={newReview.rating}
                                    onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                    className="border rounded p-1 outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    {[5, 4, 3, 2, 1].map(r => (
                                        <option key={r} value={r}>{'★'.repeat(r)}{'☆'.repeat(5-r)} ({r})</option>
                                    ))}
                                </select>
                            </div>
                            <textarea
                                placeholder="Напишіть ваші враження..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-green-500 outline-none resize-none mb-4"
                                required
                            />
                            <button type="submit" disabled={isSubmitting} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-400">
                                {isSubmitting ? 'Надсилання...' : 'Надіслати відгук'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Список відгуків */}
                <div className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <div key={review.reviewId} className="border-b border-gray-100 pb-6 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                                            {review.user?.firstName?.charAt(0) || 'А'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{review.user?.firstName || 'Анонім'} {review.user?.lastName}</p>
                                            <div className="text-yellow-400 text-sm">{'★'.repeat(review.raiting)}{'☆'.repeat(5-review.raiting)}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
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