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
    // Додано lastName та numberPhone, як очікує бекенд DTO
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', numberPhone: '' });
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
            const response = await baseClient.post(`${API_URL}/register`, formData);

            if (response.data && response.data.token) {
                toast.success("Реєстрація успішна! Тепер увійдіть.");
                navigate('/login'); // Перенаправляємо на вхід
            }

        } catch (err) {
            if (err.response?.status === 409 || (err.response?.data?.message && err.response.data.message.includes("Email already exists"))) {
                setError('Користувач з цією поштою вже існує.');
            } else {
                setError('Помилка реєстрації. Перевірте дані та зв\'язок з бекендом.');
            }
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-3xl font-bold text-green-600">Реєстрація</h2>
            {error && <p className="bg-red-100 text-red-600 p-3 rounded-lg text-sm">{error}</p>}

            {/* ПІБ, Телефон, Email, Пароль */}
            {['firstName', 'lastName', 'numberPhone', 'email', 'password'].map(field => (
                <input
                    key={field}
                    type={field.includes('password') ? 'password' : field.includes('email') ? 'email' : 'text'}
                    name={field}
                    required
                    className="w-full border p-3 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    onChange={handleChange}
                />
            ))}

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
// 2. КОМПОНЕНТ ВХОДУ
// ----------------------------------------------------------------------
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useUser(); // <-- Функція login з контексту
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || { pathname: "/profile" };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            // 1. POST /api/auth/authenticate
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
    // Перевіряємо URL для перемикання форми
    const isLoginMode = location.pathname === '/login';
    const { authData } = useUser();

    // Якщо користувач вже увійшов
    if (authData.isAuthenticated) {
        return <div className="text-center p-10">
            <h2 className="text-2xl font-bold">Ви вже увійшли!</h2>
            <Link to="/profile" className="text-green-600 mt-4 block">Перейти до профілю</Link>
        </div>
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">

                {/* КНОПКИ-ПЕРЕМИКАЧІ */}
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