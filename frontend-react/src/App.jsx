import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// === КОНТЕКСТИ ===
import { useUser } from './context/UserContext';

// === КОМПОНЕНТИ ===
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// === СТОРІНКИ ===
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import About from './pages/About.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import ProductPage from './pages/ProductPage.jsx';
import NotFound from './pages/NotFound.jsx';
import Auth from './pages/Auth.jsx';
import Profile from './pages/Profile.jsx';
import Wishlist from './pages/Wishlist.jsx';
import FarmerDashboard from './pages/FarmerDashboard';
import ProductForm from './pages/ProductForm';
import SellerProfile from './pages/SellerProfile';


// -----------------------------------------------------------------------------
// 💡 КОМПОНЕНТ ЗАХИЩЕНОГО МАРШРУТУ (Гарантовано безпечний)
// -----------------------------------------------------------------------------
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { authData, isLoading } = useUser();
    const location = useLocation();

    // NOTE: Перевірка isLoading винесена на рівень батьківського компонента App!

    // 1. Якщо НЕ авторизований (і завантаження завершено), редирект на вхід
    if (!authData.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Перевірка ролей
    const userRole = authData.role;
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return (
            <div className="text-center p-10 bg-red-100 text-red-700">
                <p className="text-xl font-bold">403 Forbidden</p>
                <p>У вас недостатньо прав ({userRole}) для доступу.</p>
            </div>
        );
    }

    // 3. Доступ дозволено
    return children;
};
// -----------------------------------------------------------------------------


export default function App() {
    const { isLoading } = useUser(); // <-- Отримуємо загальний стан завантаження

    // 1. Якщо контекст ще завантажується, блокуємо рендеринг всього UI (вирішуємо проблему циклу)
    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600"></div>
                <p className="mt-4 text-gray-600">Ініціалізація даних...</p>
            </div>
        );
    }

    // 2. Рендеримо UI тільки після завершення завантаження
    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-900">

            <Header />

            <main className="flex-grow">
                <Routes>
                    {/* Публічні маршрути */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:categoryName" element={<Products />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/cart" element={<Cart />} />

                    <Route path="/seller/:id" element={<SellerProfile />} />
                    {/* Аутентифікація */}
                    <Route path="/login" element={<Auth />} />
                    <Route path="/register" element={<Auth />} />

                    {/* Сторінки Фермера */}
                    <Route path="/farmer-dashboard" element={
                        <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                            <FarmerDashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/farmer/add-product" element={
                        <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                            <ProductForm />
                        </ProtectedRoute>
                    } />

                    <Route path="/farmer/edit-product/:id" element={
                        <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                            <ProductForm />
                        </ProtectedRoute>
                    } />

                    {/* Захищені маршрути */}
                    <Route path="/checkout" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'FARMER', 'ADMIN']}><Checkout /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'FARMER', 'ADMIN']}><Profile /></ProtectedRoute>} />
                    <Route path="/wishlist" element={<ProtectedRoute allowedRoles={['CUSTOMER', 'FARMER', 'ADMIN']}><Wishlist /></ProtectedRoute>} />

                    {/* Адміністративний маршрут (Приклад) */}
                    <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><h1 className="p-10 text-center text-3xl font-bold text-red-700">Адмін Панель</h1></ProtectedRoute>} />

                    {/* Помилка 404 */}
                    <Route path="*" element={<NotFound />} />


                </Routes>
            </main>

            <Footer />
        </div>
    );
}