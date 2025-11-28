import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, categories, subcategoryTranslations } from '../data/products';
import ProductCard from '../components/ProductCard';

const Products = () => {
    const { categoryName } = useParams();
    
    const [displayProducts, setDisplayProducts] = useState([]);
    const [activeSubcategory, setActiveSubcategory] = useState('all');
    
    // 🔥 СТАН ДЛЯ СОРТУВАННЯ 🔥
    const [sortOption, setSortOption] = useState('default');

    const mainCategoryProducts = categoryName 
        ? products.filter(p => p.category === categoryName)
        : products;

    const availableSubcategories = ['all', ...new Set(mainCategoryProducts.map(p => p.subcategory).filter(Boolean))];

    // Логіка фільтрації ТА сортування
    useEffect(() => {
        let result = [...mainCategoryProducts]; // Копіюємо масив

        // 1. Фільтр по підкатегорії
        if (activeSubcategory !== 'all') {
            result = result.filter(p => p.subcategory === activeSubcategory);
        }

        // 2. Сортування
        if (sortOption === 'cheap') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'expensive') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'name') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        setDisplayProducts(result);
    }, [categoryName, activeSubcategory, sortOption]); // Додали sortOption в залежності

    useEffect(() => {
        setActiveSubcategory('all');
        setSortOption('default');
    }, [categoryName]);

    const getCategoryTitle = (slug) => {
        if (!slug) return 'Весь Каталог';
        const found = categories.find(cat => cat.link.includes(slug));
        return found ? found.name : 'Продукти';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                
                <aside className="hidden md:block w-1/4 sticky top-24 h-[calc(100vh-120px)]">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 shrink-0">Відділи</h3>
                        <ul className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                            <li>
                                <Link to="/products" className={`block px-4 py-2 rounded-lg transition ${!categoryName ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    📦 Всі товари
                                </Link>
                            </li>
                            {categories.map(cat => {
                                const slug = cat.link.split('/').pop();
                                const isActive = categoryName === slug;
                                return (
                                    <li key={cat.name}>
                                        <Link to={cat.link} className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            <img src={cat.image} alt="" className="w-6 h-6 rounded-full object-cover"/>
                                            {cat.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </aside>

                <main className="w-full md:w-3/4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b-2 border-lime-300 pb-3">
                        <h1 className="text-3xl font-black text-gray-800">
                            {getCategoryTitle(categoryName)}
                        </h1>
                        
                        {/* 🔥 ВИПАДАЮЧИЙ СПИСОК СОРТУВАННЯ 🔥 */}
                        <select 
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5 outline-none shadow-sm"
                        >
                            <option value="default">За замовчуванням</option>
                            <option value="cheap">Від дешевих до дорогих</option>
                            <option value="expensive">Від дорогих до дешевих</option>
                            <option value="name">За назвою (А-Я)</option>
                        </select>
                    </div>

                    {availableSubcategories.length > 1 && (
                        <div className="mb-8 flex flex-wrap gap-3">
                            {availableSubcategories.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => setActiveSubcategory(sub)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition duration-300 shadow-sm border
                                        ${activeSubcategory === sub 
                                            ? 'bg-green-600 text-white border-green-600 transform scale-105' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600'
                                        }`}
                                >
                                    {subcategoryTranslations[sub] || sub}
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {displayProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displayProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-400 text-xl mb-4">В цій категорії поки порожньо...</p>
                            {mainCategoryProducts.length === 0 ? (
                                <Link to="/products" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg inline-block">
                                    Перейти до всіх товарів
                                </Link>
                            ) : (
                                <button onClick={() => setActiveSubcategory('all')} className="text-green-600 font-bold hover:underline">
                                    Показати всі товари в цій категорії
                                </button>
                            )}
                        </div>
                    )}
                </main>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4ade80; }`}</style>
        </div>
    );
};

export default Products;