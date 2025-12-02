import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useMarketData } from '../context/MarketDataContext'; // <-- НОВИЙ ІМПОРТ API
import heroBgImage from '../assets/hero-storefront.jpg';

const Home = () => {
    const { products, loadingData } = useMarketData(); // <-- Отримуємо продукти з API

    return (
        <>
            {/* ===== HERO БЛОК (Без змін) ===== */}
            <div
                className="relative h-[90vh] bg-cover bg-center"
                style={{ backgroundImage: `url(${heroBgImage})` }}
            >
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center p-4">
                    {/* Затемнення */}
                    <div className="absolute inset-0 bg-black/50"></div>

                    <div className="relative z-20 max-w-4xl">
                <span className="uppercase tracking-widest text-lime-400 font-bold mb-4 block">
                    Фермерський Ринок Онлайн
                </span>
                        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 drop-shadow-lg">
                            Справжня Їжа.<br/> Чесна Ціна.
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-2xl mx-auto font-light">
                            Ми доставляємо найкращі фермерські продукти прямо до ваших дверей.
                            Скуштуйте різницю вже сьогодні.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/products"
                                className="bg-lime-500 hover:bg-lime-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl transition duration-300 transform hover:scale-105"
                            >
                                Всі Товари
                            </Link>
                            <Link
                                to="/about"
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-4 px-10 rounded-full text-lg shadow-xl transition duration-300"
                            >
                                Про Нас
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== СЕКЦІЯ ПОПУЛЯРНІ ТОВАРИ (API) ===== */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">

                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Хіти продажів 🔥
                            </h2>
                            <p className="text-gray-500 mt-2">Те, що наші клієнти обирають найчастіше</p>
                        </div>
                        <Link to="/products" className="hidden md:block text-green-600 font-bold hover:underline">
                            Дивитись все →
                        </Link>
                    </div>

                    {loadingData ? (
                        <div className="text-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 inline-block"></div><p className="mt-4 text-gray-600">Завантаження хітів...</p></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Беремо перші 4 товари з API для вітрини */}
                            {products.slice(0, 4).map(product => (
                                // Використовуємо ProductCard з даними DTO
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Кнопка для мобільних */}
                    <div className="text-center mt-12 md:hidden">
                        <Link
                            to="/products"
                            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full transition duration-300"
                        >
                            Переглянути Всі Товари
                        </Link>
                    </div>
                </div>
            </div>

            {/* ===== СЕКЦІЯ ПЕРЕВАГ (Без змін) ===== */}
            <div className="py-16 bg-green-50 border-t border-green-100">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            🚚
                        </div>
                        <h3 className="text-xl font-bold mb-2">Швидка Доставка</h3>
                        <p className="text-gray-600">Доставляємо замовлення день у день, щоб зберегти свіжість.</p>
                    </div>
                    <div className="p-6">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            🥬
                        </div>
                        <h3 className="text-xl font-bold mb-2">Тільки Свіже</h3>
                        <p className="text-gray-600">Ніяких складів. Продукти їдуть до вас прямо з грядки.</p>
                    </div>
                    <div className="p-6">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                            ❤️
                        </div>
                        <h3 className="text-xl font-bold mb-2">З Любов'ю</h3>
                        <p className="text-gray-600">Підтримуємо локальних фермерів та розвиваємо українське.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;