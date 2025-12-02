import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAxiosClient } from '../api/axiosClient'; // <-- Клієнт для API
import toast from 'react-hot-toast';

// 🇺🇦 СЛОВНИК ПІДКАТЕГОРІЙ (Мок-дані для відображення, поки не буде реального API підкатегорій)
// У реальному застосунку, ці переклади варто зберігати на бекенді або в окремому JSON
const MOCK_SUBCAT_TRANSLATIONS = {
    // Ці дані потрібно отримати з бекенду, але для відображення UI поки використовуємо мок
    apples: "🍎 Яблука", pears: "🍐 Груші", tomatoes: "🍅 Томати",
    potatoes: "🥔 Картопля", meat: "🥩 М'ясо", eggs: "🥚 Яйця",
    all: "📦 Всі товари"
};

const Products = () => {
    const { categoryName } = useParams();
    const client = getAxiosClient();

    // Стан для даних, отриманих з API
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // Стан UI
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSubcategory, setActiveSubcategory] = useState('all');
    const [sortOption, setSortOption] = useState('default');

    // ------------------------------------------------------------------
    // 1. ЗАВАНТАЖЕННЯ ДАНИХ З API (Products та Categories)
    // ------------------------------------------------------------------
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Завантажуємо продукти
                const productsRes = await client.get('/products');
                setAllProducts(productsRes.data);

                // Завантажуємо категорії
                const categoriesRes = await client.get('/categories');
                setCategories(categoriesRes.data);

                setError(null);
            } catch (err) {
                console.error("Помилка завантаження каталогу:", err);
                setError("Не вдалося завантажити товари та категорії. Перевірте бекенд.");
                toast.error("Помилка завантаження каталогу.");
            } finally {
                setIsLoading(false);
            }
        };

        // Запускаємо завантаження
        fetchAllData();
    }, []);
    // Викликається лише один раз при першому завантаженні компонента

    // Скидання фільтрів при зміні URL категорії
    useEffect(() => {
        setActiveSubcategory('all');
        setSortOption('default');
    }, [categoryName]);

    // ------------------------------------------------------------------
    // 2. ФІЛЬТРАЦІЯ ТА СОРТУВАННЯ (Логіка на фронтенді)
    // ------------------------------------------------------------------
    const processedProducts = useMemo(() => {
        let result = [...allProducts];

        // Фільтр 1: Поточна категорія (за URL)
        if (categoryName) {
            // Припускаємо, що DTO продукту містить поле 'categoryName'
            result = result.filter(p => p.category?.name?.toLowerCase() === categoryName.toLowerCase());
        }

        // Фільтр 2: Підкатегорія (цей фільтр є мок-фільтром, оскільки на бекенді немає 'subcategory')
        // Тут ми залишаємо його для прикладу:
        /*
        if (activeSubcategory !== 'all' && activeSubcategory !== '') {
            result = result.filter(p => p.subcategory?.toLowerCase() === activeSubcategory.toLowerCase());
        }
        */

        // Сортування
        if (sortOption === 'cheap') {
            // Сортування за ціною (поле 'price' з DTO)
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'expensive') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'name') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [allProducts, categoryName, activeSubcategory, sortOption]);

    // Визначаємо доступні підкатегорії (для мок-кнопок)
    const availableSubcategories = useMemo(() => {
        // Якщо у вас буде реальне поле subcategory в DTO, тут буде логіка:
        // const subs = mainCategoryProducts.map(p => p.subcategory).filter(Boolean);
        // return ['all', ...new Set(subs)];
        // Наразі повертаємо мок-дані
        return ['all', 'apples', 'tomatoes'];
    }, [processedProducts]);


    // ------------------------------------------------------------------
    // 3. UI ТА ВІДОБРАЖЕННЯ
    // ------------------------------------------------------------------

    const getCategoryTitle = (slug) => {
        if (!slug) return 'Весь Каталог';
        const found = categories.find(cat => cat.name?.toLowerCase() === slug.toLowerCase());
        return found ? found.name : 'Продукти';
    };

    if (isLoading) {
        return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 inline-block"></div><p className="mt-4 text-gray-600">Завантаження каталогу...</p></div>;
    }

    if (error) {
        return <div className="text-center py-20 bg-red-50 text-red-700 rounded-xl mx-auto max-w-lg">
            <h2 className="text-2xl font-bold mb-3">Помилка API</h2>
            <p>{error}</p>
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">

                {/* ASIDE: Навігація категорій */}
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
                                // Ми повинні використовувати slug або ID
                                const slug = cat.name?.toLowerCase();
                                const isActive = categoryName === slug;
                                return (
                                    <li key={cat.categoryId}>
                                        <Link to={`/products/${slug}`} className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${isActive ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            {/* cat.image тут недоступний, використовуємо заглушку */}
                                            <div className="w-6 h-6 rounded-full bg-gray-200 object-cover flex items-center justify-center text-sm">C</div>
                                            <span className="font-medium">{cat.name}</span>
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

                        {/* ВИПАДАЮЧИЙ СПИСОК СОРТУВАННЯ */}
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
                                    {MOCK_SUBCAT_TRANSLATIONS[sub] || sub}
                                </button>
                            ))}
                        </div>
                    )}

                    {processedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {processedProducts.map(product => (
                                // product.productId - тепер ID з БД, а не мок-id
                                <ProductCard key={product.productId} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-400 text-xl mb-4">В цій категорії поки порожньо...</p>
                            {categoryName && (
                                <Link to="/products" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg inline-block">
                                    Перейти до всіх товарів
                                </Link>
                            )}
                        </div>
                    )}
                </main>
            </div>
            {/* Стилі для кастомного скролбару */}
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4ade80; }`}</style>
        </div>
    );
};

export default Products;