import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import baseClient from '../api/axiosClient'; // <-- Клієнт без токена
import { useUser } from '../context/UserContext'; // <-- Контекст для login/logout

const API_URL = '/api/auth'; // Базовий URL для аутентифікації

// ----------------------------------------------------------------------
// 1. КОМПОНЕНТ РЕЄСТРАЦІЇ
// ----------------------------------------------------------------------
const RegisterForm = () => {
    // ВАЖЛИВО: Додано selectedRole
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        numberPhone: '',
        selectedRole: 'CUSTOMER' // <--- НОВЕ: Роль за замовчуванням
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // POST /api/auth/register
            // Відправляємо formData, яке тепер містить selectedRole: 'CUSTOMER' або 'FARMER'
            const response = await baseClient.post(`${API_URL}/register`, formData);

            if (response.data && response.data.token) {
                toast.success("Реєстрація успішна! Тепер увійдіть.");
                navigate('/login'); // Перенаправляємо на вхід
            }

        } catch (err) {
            // ... (обробка помилок)
            if (err.response?.status === 409 || (err.response?.data?.message && err.response.data.message.includes("Email already exists"))) {
                setError('Користувач з цією поштою вже існує.');
            } else if (err.response?.data?.message) {
                // Включимо повідомлення про помилку ролі, якщо воно є
                setError(err.response.data.message);
            } else {
                setError('Помилка реєстрації. Перевірте дані та зв\'язок з бекендом.');
            }
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleRegister} className="space-y-5">
            <h2 className="text-3xl font-bold text-green-600">Реєстрація</h2>
            {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">{error}</p>}

            {/* Ім'я */}
            <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Ім'я"
            />

            {/* Прізвище */}
            <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Прізвище"
            />

            {/* Номер телефону */}
            <input
                type="text"
                name="numberPhone"
                value={formData.numberPhone}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Номер телефону"
            />

            {/* Email */}
            <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Email"
            />

            {/* Пароль */}
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Пароль"
            />

            {/* 🔥 НОВИЙ БЛОК: Вибір ролі 🔥 */}
            <div className="space-y-2 pt-2">
                <label className="block text-sm font-semibold text-gray-700">Я хочу зареєструватися як:</label>
                <div className="flex space-x-4">

                    {/* Покупець (CUSTOMER) */}
                    <label
                        className={`flex items-center p-3 rounded-lg border cursor-pointer w-1/2 transition ${formData.selectedRole === 'CUSTOMER' ? 'bg-green-100 border-green-500' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                    >
                        <input
                            type="radio"
                            name="selectedRole"
                            value="CUSTOMER"
                            checked={formData.selectedRole === 'CUSTOMER'}
                            onChange={handleChange}
                            className="text-green-600 focus:ring-green-500 w-4 h-4 mr-3"
                        />
                        <div>
                            <span className="block font-bold text-gray-800">Покупець 🛒</span>
                            <span className="text-xs text-gray-500">Купую товари на ринку.</span>
                        </div>
                    </label>

                    {/* Продавець (FARMER) */}
                    <label
                        className={`flex items-center p-3 rounded-lg border cursor-pointer w-1/2 transition ${formData.selectedRole === 'FARMER' ? 'bg-green-100 border-green-500' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                    >
                        <input
                            type="radio"
                            name="selectedRole"
                            value="FARMER"
                            checked={formData.selectedRole === 'FARMER'}
                            onChange={handleChange}
                            className="text-green-600 focus:ring-green-500 w-4 h-4 mr-3"
                        />
                        <div>
                            <span className="block font-bold text-gray-800">Продавець 🧑‍🌾</span>
                            <span className="text-xs text-gray-500">Створюю та продаю товари.</span>
                        </div>
                    </label>

                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
            >
                {isSubmitting ? 'Обробка...' : 'Зареєструватися'}
            </button>
        </form>
    );
};

// ----------------------------------------------------------------------
// 2. КОМПОНЕНТ ВХОДУ (Залишається без змін, оскільки він коректний)
// ----------------------------------------------------------------------
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || { pathname: "/profile" };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // POST /api/auth/authenticate
            const response = await baseClient.post(`${API_URL}/authenticate`, { email, password });

            // 2. Зберігаємо токен у контекст і стейт
            const token = response.data.token;
            await login(token);

            navigate(from, { replace: true });

        } catch (err) {
            if (err.response?.status === 403 || err.response?.status === 401) {
                setError('Невірний email або пароль.');
            } else {
                setError('Помилка підключення до сервера.');
            }
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <h2 className="text-3xl font-bold text-green-600">Вхід</h2>
            {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">{error}</p>}

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
            >
                {isSubmitting ? 'Перевірка...' : 'Увійти'}
            </button>
        </form>
    );
};

// ----------------------------------------------------------------------
// 3. ГОЛОВНИЙ КОМПОНЕНТ AUTH.JSX
// ----------------------------------------------------------------------
function Auth() {
    const location = useLocation();
    const isLoginMode = location.pathname === '/login';
    const { authData } = useUser();

    if (authData.isAuthenticated) {
        return <div className="text-center p-10">
            <h2 className="text-2xl font-bold">Ви вже увійшли!</h2>
            <Link to="/profile" className="text-green-600 mt-4 block">Перейти до профілю</Link>
        </div>
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">

                <div className="flex justify-center mb-6 border-b">
                    <Link to="/login"
                          className={`flex-1 py-2 rounded-md text-sm font-bold text-center transition duration-300 ${isLoginMode ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                    >
                        Вхід
                    </Link>
                    <Link to="/register"
                          className={`flex-1 py-2 rounded-md text-sm font-bold text-center transition duration-300 ${!isLoginMode ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                    >
                        Реєстрація
                    </Link>
                </div>

                <div className="py-4">
                    {isLoginMode ? <LoginForm /> : <RegisterForm />}
                </div>

            </div>
        </div>
    );
}

export default Auth;