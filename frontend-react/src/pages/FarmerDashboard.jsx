import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getAxiosClient } from '../api/axiosClient';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa'; // Переконайся, що встановлено: npm install react-icons

const FarmerDashboard = () => {
    const { authData } = useUser();
    const [myProducts, setMyProducts] = useState([]);
    const [incomingOrders, setIncomingOrders] = useState([]);
    const [myReviews, setMyReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const client = getAxiosClient();
    const navigate = useNavigate();

    // Розрахунок середнього рейтингу
    const calculateRating = () => {
        if (myReviews.length === 0) return 0;
        const total = myReviews.reduce((sum, r) => {
            const val = r.raiting === 'FIVE' ? 5 : r.raiting === 'FOUR' ? 4 : r.raiting === 'THREE' ? 3 : r.raiting === 'TWO' ? 2 : 1;
            return sum + val;
        }, 0);
        return (total / myReviews.length).toFixed(1);
    };

    useEffect(() => {
        if (authData.role === 'FARMER' || authData.role === 'ADMIN') {
            fetchData();
        } else {
            navigate('/');
        }
    }, [authData.userId, authData.role, navigate]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Товари
            const prodRes = await client.get('/api/products');
            // Фільтруємо, щоб показати тільки товари цього фермера
            const myProds = prodRes.data.filter(p => p.ownerId === authData.userId || p.user?.userId === authData.userId);
            setMyProducts(myProds);

            // 2. Замовлення
            const ordersRes = await client.get('/api/orders/incoming');
            setIncomingOrders(ordersRes.data);

            // 3. Відгуки
            const reviewsRes = await client.get('/api/reviews/my-products');
            setMyReviews(reviewsRes.data);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await client.put(`/api/orders/${orderId}/status`, JSON.stringify(newStatus), {
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success(`Статус оновлено!`);
            fetchData();
        } catch (error) {
            toast.error("Помилка оновлення статусу");
        }
    };

    const handleDeleteProduct = async (id) => {
        if(!window.confirm("Ви впевнені, що хочете видалити цей товар?")) return;
        try {
            await client.delete(`/api/products/${id}`);
            toast.success("Товар видалено!");
            fetchData();
        } catch (error) {
            toast.error("Помилка видалення товару");
        }
    };

    const toggleOrderDetails = (id) => setExpandedOrderId(expandedOrderId === id ? null : id);

    if (isLoading) return <div className="text-center py-20 font-bold text-gray-500">Завантаження панелі...</div>;

    const rating = calculateRating();

    return (
        <div className="container mx-auto px-4 py-10">
            {/* --- ВЕРХНЯ ЧАСТИНА: ЗАГОЛОВОК І РЕЙТИНГ --- */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">👨‍🌾 Кабінет Фермера</h1>

                <div className="bg-yellow-50 border border-yellow-200 px-6 py-2 rounded-xl flex items-center gap-3 shadow-sm">
                    <div>
                        <span className="text-xs font-bold text-yellow-700 uppercase block">Мій рейтинг</span>
                        <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-400" />
                            <span className="text-2xl font-black text-gray-800">{rating}</span>
                            <span className="text-gray-400 text-sm">/ 5</span>
                        </div>
                    </div>
                    <div className="text-right border-l border-yellow-200 pl-3">
                        <span className="block text-xl font-bold text-gray-800">{myReviews.length}</span>
                        <span className="text-xs text-gray-500">Відгуків</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                {/* --- ЛІВА КОЛОНКА: ЗАМОВЛЕННЯ --- */}
                <div>
                    <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                        📦 Вхідні замовлення <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">{incomingOrders.length}</span>
                    </h2>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-h-[600px] overflow-y-auto">
                        {incomingOrders.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">Немає активних замовлень</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {incomingOrders.map(order => (
                                    <div key={order.orderId} className="group">
                                        <div
                                            className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition ${expandedOrderId === order.orderId ? 'bg-blue-50' : ''}`}
                                            onClick={() => toggleOrderDetails(order.orderId)}
                                        >
                                            <div>
                                                <div className="font-bold text-gray-800">#{order.orderId} <span className="font-normal text-gray-500 text-sm">від {new Date(order.orderDate).toLocaleDateString()}</span></div>
                                                <div className="text-sm text-gray-600">{order.user?.firstName} {order.user?.lastName}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-green-600">{order.totalAmount} грн</div>
                                                <select
                                                    onClick={e => e.stopPropagation()}
                                                    value={order.deliveryStatus}
                                                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                                    className={`mt-1 text-xs border rounded p-1 font-bold cursor-pointer outline-none 
                                                        ${order.deliveryStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-white text-gray-700'}
                                                    `}
                                                >
                                                    <option value="IN_PROGRESS">В обробці</option>
                                                    <option value="COMPLETED">Виконано</option>
                                                    <option value="CANCELLED">Скасовано</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Деталі замовлення (розгортаються) */}
                                        {expandedOrderId === order.orderId && (
                                            <div className="bg-blue-50 p-4 text-sm animate-fadeIn border-t border-blue-100">
                                                <div className="mb-3">
                                                    <span className="text-xs text-gray-500 uppercase font-bold">Адреса доставки:</span>
                                                    <p className="text-gray-800">{order.deliveryAddress || 'Самовивіз'}</p>
                                                    <p className="text-gray-600">{order.user?.numberPhone}</p>
                                                </div>
                                                <ul className="space-y-2 bg-white p-3 rounded-lg border border-blue-100">
                                                    {order.orderItems?.map((item, idx) => (
                                                        <li key={idx} className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
                                                                    {item.product?.image && <img src={item.product.image} className="w-full h-full object-cover" alt="" />}
                                                                </div>
                                                                <span>{item.product?.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                                            </div>
                                                            <span className="font-bold">{(item.price * item.quantity).toFixed(2)} грн</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- ПРАВА КОЛОНКА: ВІДГУКИ --- */}
                <div>
                    <h2 className="text-xl font-bold text-gray-700 mb-4">💬 Останні відгуки</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 max-h-[600px] overflow-y-auto">
                        {myReviews.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-lg">
                                <p className="text-gray-400">Ще немає відгуків на ваші товари.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {myReviews.map(review => (
                                    <li key={review.reviewId} className="border-b border-gray-100 pb-4 last:border-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm text-gray-800">
                                                {review.product?.name || "Товар видалено"}
                                            </span>
                                            <div className="flex text-yellow-400 text-xs">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < (review.raiting === 'FIVE' ? 5 : review.raiting === 'FOUR' ? 4 : review.raiting === 'THREE' ? 3 : review.raiting === 'TWO' ? 2 : 1) ? 'text-yellow-400' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm italic bg-gray-50 p-2 rounded-lg mb-2">"{review.comment}"</p>
                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                            <span>👤 {review.user?.firstName}</span>
                                            <span>📅 {new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* --- НИЖНІЙ БЛОК: МОЇ ТОВАРИ (ТЕПЕР ВІН ТУТ Є!) --- */}
            <div className="border-t pt-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-700">🍏 Мої товари</h2>
                    <Link to="/farmer/add-product" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700 transition flex items-center gap-2">
                        <span>+</span> Додати Товар
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myProducts.map(product => (
                        <div key={product.productId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition">
                            <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transform group-hover:scale-105 transition duration-500"/>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300">Немає фото</div>
                                )}

                                {/* Бейдж наявності */}
                                <div className="absolute top-2 right-2">
                                     <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase shadow-sm ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.inStock ? 'В наявності' : 'Немає'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
                                <p className="text-green-600 font-bold text-xl mb-4">{product.price} грн</p>

                                <div className="mt-auto flex border rounded-lg overflow-hidden">
                                    <Link to={`/farmer/edit-product/${product.productId}`} className="flex-1 py-2 text-center bg-gray-50 text-blue-600 text-sm font-bold hover:bg-blue-50 transition border-r border-gray-200">
                                        Змінити
                                    </Link>
                                    <button onClick={() => handleDeleteProduct(product.productId)} className="flex-1 py-2 text-center bg-gray-50 text-red-600 text-sm font-bold hover:bg-red-50 transition">
                                        Видалити
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Картка "Додати товар" (порожня) */}
                    <Link to="/farmer/add-product" className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-green-500 hover:text-green-500 transition cursor-pointer min-h-[300px]">
                        <span className="text-4xl mb-2">+</span>
                        <span className="font-bold">Додати новий товар</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;