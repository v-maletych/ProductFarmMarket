import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext'; // Імпорт для юзера
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useUser();

  const product = products.find(p => p.id === parseInt(id));

  // --- ЛОГІКА ВІДГУКІВ ---
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });

  // Завантажуємо відгуки при відкритті
  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem('reviews')) || {};
    if (savedReviews[id]) {
      setReviews(savedReviews[id]);
    }
  }, [id]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Увійдіть, щоб залишити відгук');
      return;
    }
    if (!newReview.text.trim()) return;

    const review = {
      id: Date.now(),
      userName: user.name,
      date: new Date().toLocaleDateString(),
      rating: newReview.rating,
      text: newReview.text
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);

    // Зберігаємо в localStorage
    const allReviews = JSON.parse(localStorage.getItem('reviews')) || {};
    allReviews[id] = updatedReviews;
    localStorage.setItem('reviews', JSON.stringify(allReviews));

    setNewReview({ rating: 5, text: '' });
    toast.success('Відгук додано!');
  };

  if (!product) return <div className="text-center py-20"><h2 className="text-2xl font-bold">Товар не знайдено 😕</h2><button onClick={() => navigate('/products')} className="mt-4 text-green-600 underline">Повернутися в каталог</button></div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-green-600 flex items-center gap-2 transition">← Назад</button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-4 border border-gray-100">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-xl transform hover:scale-105 transition duration-500" />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-green-600 font-bold text-sm tracking-wider uppercase mb-2">{product.category || 'Свіжі продукти'}</span>
          <h1 className="text-4xl font-black text-gray-800 mb-4">{product.name}</h1>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">{product.description}<br/><br/>Наші продукти вирощуються на екологічно чистих фермах без використання пестицидів. Ми гарантуємо свіжість та найвищу якість кожного замовлення.</p>
          <div className="flex items-center gap-6 mb-8"><span className="text-4xl font-bold text-gray-900">{product.price} грн</span><span className="text-gray-500 text-xl">/ {product.unit}</span></div>
          <div className="flex gap-4">
            <button onClick={() => addToCart(product)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition transform hover:-translate-y-1 flex justify-center items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              Додати в кошик
            </button>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg"><span className="block font-bold text-green-700">100%</span><span className="text-xs text-green-600">Органіка</span></div>
            <div className="p-3 bg-green-50 rounded-lg"><span className="block font-bold text-green-700">24/7</span><span className="text-xs text-green-600">Підтримка</span></div>
            <div className="p-3 bg-green-50 rounded-lg"><span className="block font-bold text-green-700">Швидка</span><span className="text-xs text-green-600">Доставка</span></div>
          </div>
        </div>
      </div>

      {/* 🔥 СЕКЦІЯ ВІДГУКІВ 🔥 */}
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Відгуки покупців ({reviews.length})</h3>
        
        {/* Форма */}
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
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>
            <textarea 
              placeholder="Напишіть ваші враження..." 
              value={newReview.text}
              onChange={(e) => setNewReview({...newReview, text: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-green-500 outline-none resize-none mb-4"
              required
            />
            <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
              Надіслати відгук
            </button>
          </form>
        </div>

        {/* Список відгуків */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{review.userName}</p>
                      <div className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <p className="text-gray-600 pl-14">{review.text}</p>
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