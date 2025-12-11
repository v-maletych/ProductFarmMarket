import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useMarketData } from '../context/MarketDataContext';

export default function Header() {
    const { getCartCount } = useCart();
    const { user, authData, isLoading } = useUser();
    const { products, categories, loadingData } = useMarketData();

    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // --- ЛОГІКА ПОШУКУ ---
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 1) {
            const results = products.filter(product =>
                product.name.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(results);
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    };

    const handleResultClick = (productId) => {
        setShowResults(false);
        setSearchTerm('');
        navigate(`/product/${productId}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const closeMenu = () => setIsMenuOpen(false);

    const userNameForAvatar = user?.firstName ? user.firstName.charAt(0).toUpperCase() : '👤';
    const wishlistCount = user?.wishlist?.length || 0;

    // 🔥 ПЕРЕВІРКА НА ФЕРМЕРА (АБО АДМІНА) 🔥
    const isFarmerOrAdmin = authData.isAuthenticated && (authData.role === 'FARMER' || authData.role === 'ADMIN');

    // Якщо дані аутентифікації ще не завантажені, показуємо заглушку
    if (isLoading || loadingData) {
        return (
            <header className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-green-700">FarmMarket</h1>
                <div className="animate-pulse w-24 h-6 bg-gray-200 rounded-lg"></div>
            </header>
        );
    }

    return (
        <>
            <header className="bg-white shadow-md sticky top-0 z-40 w-full">
                <div className="relative w-full px-6 md:px-10 py-4 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">

                    {/* ЛІВА ЧАСТИНА */}
                    <div className="flex items-center gap-4 z-10 shrink-0">
                        <button onClick={() => setIsMenuOpen(true)} className="p-1 text-gray-600 hover:text-green-600 transition focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <Link to="/" className="text-2xl md:text-3xl font-black text-green-600 tracking-tight whitespace-nowrap">FarmMarket</Link>
                    </div>

                    {/* ПОШУК (ЦЕНТР) */}
                    <div className="relative w-full md:max-w-md order-last md:order-none" ref={searchRef}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={loadingData ? "Завантаження..." : "Я шукаю..."}
                                value={searchTerm}
                                onChange={handleSearch}
                                onFocus={() => searchTerm.length > 1 && setShowResults(true)}
                                disabled={loadingData}
                                className="w-full border border-gray-300 bg-gray-50 pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>

                        {showResults && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl mt-2 border border-gray-100 max-h-80 overflow-y-auto z-50">
                                {searchResults.length > 0 ? (
                                    <ul>
                                        {searchResults.map(product => (
                                            <li key={product.productId} onClick={() => handleResultClick(product.productId)} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition border-b last:border-b-0">
                                                <img src={product.image || 'https://placehold.co/40x40'} alt={product.name} className="w-10 h-10 rounded object-cover" />
                                                <div>
                                                    <p className="font-bold text-gray-800 text-sm">{product.name}</p>
                                                    <p className="text-xs text-green-600 font-bold">{product.price} грн</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">Нічого не знайдено 😔</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ПРАВА ЧАСТИНА */}
                    <div className="flex items-center gap-4 md:gap-6 shrink-0 ml-auto md:ml-0">
                        <nav className="hidden lg:flex items-center gap-6 font-medium text-gray-600">
                            <Link to="/" className="hover:text-green-500 transition">Головна</Link>
                            <Link to="/products" className="hover:text-green-500 transition">Каталог</Link>

                            {/* 🔥 ПОСИЛАННЯ ДЛЯ ФЕРМЕРА (ДЕСКТОП) 🔥 */}
                            {isFarmerOrAdmin && (
                                <Link to="/farmer-dashboard" className="text-green-700 font-bold hover:text-green-900 transition flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                                    👨‍🌾 Панель Фермера
                                </Link>
                            )}
                        </nav>

                        <div className="hidden md:block h-6 w-px bg-gray-300"></div>

                        {/* ПРОФІЛЬ */}
                        {authData.isAuthenticated ? (
                            <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition group">
                                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold shadow-sm group-hover:bg-green-200 transition">
                                    {userNameForAvatar}
                                </div>
                            </Link>
                        ) : (
                            <Link to="/login" className="text-gray-600 hover:text-green-600 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                            </Link>
                        )}

                        {/* WISHLIST */}
                        <Link to="/wishlist" className="relative text-gray-600 hover:text-red-500 transition p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* КОШИК */}
                        <Link to="/cart" className="relative text-gray-700 hover:text-green-500 transition p-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>

            {/* ШТОРКА (Sidebar) */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={closeMenu}></div>
            <div className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-5 border-b flex justify-between items-center bg-green-50">
                    <span className="text-xl font-bold text-gray-800">Меню</span>
                    <button onClick={closeMenu} className="text-gray-500 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="p-4">
                    {/* Мобільне меню */}
                    <div className="mb-6 pb-6 border-b md:hidden space-y-2">
                        {authData.isAuthenticated ? (
                            <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-green-800 font-bold mb-4">👤 Особистий кабінет</Link>
                        ) : (
                            <Link to="/login" onClick={closeMenu} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg text-gray-700 font-bold mb-4">🔑 Увійти</Link>
                        )}

                        <Link to="/" onClick={closeMenu} className="block py-2 text-lg font-medium text-gray-700 hover:text-green-600">🏠 Головна</Link>
                        <Link to="/products" onClick={closeMenu} className="block py-2 text-lg font-medium text-gray-700 hover:text-green-600">📦 Весь Каталог</Link>

                        {/* 🔥 ПОСИЛАННЯ ДЛЯ ФЕРМЕРА (МОБІЛЬНЕ) 🔥 */}
                        {isFarmerOrAdmin && (
                            <Link to="/farmer-dashboard" onClick={closeMenu} className="block py-2 text-lg font-bold text-green-700 hover:text-green-900 bg-green-50 px-2 rounded">
                                👨‍🌾 Панель Фермера
                            </Link>
                        )}

                        <Link to="/wishlist" onClick={closeMenu} className="block py-2 text-lg font-medium text-gray-700 hover:text-red-500">❤️ Обране</Link>
                    </div>

                    <h3 className="text-gray-400 uppercase text-xs font-bold mb-3 tracking-wider">Категорії</h3>

                    {loadingData ? (
                        <p className="text-sm text-gray-400">Завантаження категорій...</p>
                    ) : (
                        <ul className="space-y-1">
                            {categories.map((cat) => (
                                <li key={cat.categoryId}>
                                    <Link to={`/products/${cat.name.toLowerCase()}`} onClick={closeMenu} className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-700 transition">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 object-cover flex items-center justify-center text-sm">{cat.name.charAt(0)}</div>
                                        <span className="font-medium">{cat.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}