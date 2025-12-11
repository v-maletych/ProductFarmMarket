// src/components/ReviewForm.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { FaStar } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8080/api/v1'; // Переконайтеся, що це правильний URL вашого бекенду

// Компонент форми для додавання нового відгуку
const ReviewForm = ({ productId, onReviewSubmitted }) => {
    const { authData } = useUser();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Перевірка, чи користувач авторизований
    if (!authData.isAuthenticated) {
        return (
            <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                Будь ласка, <a href="/login" className="font-semibold underline">увійдіть</a>, щоб залишити відгук.
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (rating === 0 || comment.trim() === '') {
            setError('Будь ласка, оберіть рейтинг та залиште коментар.');
            return;
        }

        setIsSubmitting(true);
        
        const reviewData = {
            productId: productId,
            raitingValue: rating, // Надсилаємо числове значення
            comment: comment.trim(),
        };

        try {
            // Токен аутентифікації беремо з контексту користувача
            const token = authData.token; 
            
            const response = await axios.post(
                `${API_BASE_URL}/reviews`,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Очищення форми
            setRating(0);
            setComment('');
            
            // Виклик функції зворотного виклику для оновлення списку відгуків на сторінці продукту
            onReviewSubmitted(response.data); 

        } catch (err) {
            console.error("Помилка під час надсилання відгуку:", err);
            // Обробка помилок (наприклад, 403 Forbidden, якщо користувач не може залишити відгук)
            const errorMessage = err.response?.data?.message || 'Не вдалося надіслати відгук. Спробуйте пізніше.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-6 p-6 border rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Залишити свій відгук</h3>
            
            <form onSubmit={handleSubmit}>
                {/* Компонент рейтингу (зірочки) */}
                <div className="flex items-center space-x-1 mb-4">
                    <span className="text-sm font-medium text-gray-600 mr-2">Ваша оцінка:</span>
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                            <label key={index}>
                                <input
                                    type="radio"
                                    name="rating"
                                    value={ratingValue}
                                    onClick={() => setRating(ratingValue)}
                                    className="hidden"
                                    disabled={isSubmitting}
                                />
                                <FaStar
                                    className="cursor-pointer transition-colors duration-200"
                                    color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                    size={24}
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            </label>
                        );
                    })}
                </div>
                
                {/* Поле коментаря */}
                <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Коментар:</label>
                    <textarea
                        id="comment"
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 resize-none"
                        placeholder="Поділіться своїми враженнями про продукт..."
                        required
                        disabled={isSubmitting}
                    ></textarea>
                </div>
                
                {/* Відображення помилки */}
                {error && (
                    <div className="p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-lg" role="alert">
                        {error}
                    </div>
                )}

                {/* Кнопка відправки */}
                <button
                    type="submit"
                    className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 disabled:opacity-50"
                    disabled={isSubmitting || rating === 0 || comment.trim() === ''}
                >
                    {isSubmitting ? 'Надсилання...' : 'Надіслати Відгук'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;