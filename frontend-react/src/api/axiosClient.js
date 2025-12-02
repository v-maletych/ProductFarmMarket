import axios from 'axios';
import { toast } from 'react-hot-toast';

// Визначаємо базовий URL. Vite proxy перенаправляє /api на http://localhost:8080
const API_URL = '/api';

// 1. Створюємо клієнт Axios без перехоплювачів
const baseClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Створюємо функцію для отримання клієнта з JWT-перехоплювачем
export const getAxiosClient = () => {
    const token = localStorage.getItem('jwtToken');

    const client = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
            // Додаємо Bearer Token
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    });

    // Додаємо перехоплювач відповідей для автоматичного виходу при 401/403
    client.interceptors.response.use(
        response => response,
        error => {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                // Якщо токен недійсний або немає прав, очищаємо токен
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('currentUser');
                toast.error("Сесія закінчилася або недостатньо прав.");
                window.location.href = '/login'; // Перенаправляємо на сторінку входу
            }
            return Promise.reject(error);
        }
    );

    return client;
};

// Експортуємо клієнт для логіну/реєстрації (де токена ще немає)
export default baseClient;