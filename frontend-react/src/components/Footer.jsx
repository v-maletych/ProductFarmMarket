import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-300 mt-16">
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* 1. Про магазин */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">ProductFarmMarket</h3>
                    <p className="text-gray-400">
                        Найсвіжіші продукти від локальних фермерів. Якість, якій ви можете довіряти.
                    </p>
                </div>

                {/* 2. Швидкі посилання */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Навігація</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-green-400">Головна</Link></li>
                        <li><Link to="/products" className="hover:text-green-400">Продукти</Link></li>
                        <li><Link to="/about" className="hover:text-green-400">Про нас</Link></li>
                    </ul>
                </div>

                {/* 3. Контакти */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Зв'яжіться з нами</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                            <a href="mailto:info@farmmarket.com" className="hover:text-green-400 transition">
                                Email: info@farmmarket.com
                            </a>
                        </li>
                        <li>
                            <a href="tel:+380001234567" className="hover:text-green-400 transition">
                                Телефон: +38 (123) 456-78-90
                            </a>
                        </li>
                        <li>Адреса: м. Львів, Україна</li>
                    </ul>
                </div>

            </div>
            <div className="bg-gray-900 py-4 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} ProductFarmMarket. Всі права захищено.
            </div>
        </footer>
    );
}