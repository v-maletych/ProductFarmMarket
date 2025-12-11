import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getAxiosClient } from '../api/axiosClient';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
    const { authData } = useUser();
    const [myProducts, setMyProducts] = useState([]);
    const [incomingOrders, setIncomingOrders] = useState([]); // 🔥 Новий стейт
    const [isLoading, setIsLoading] = useState(true);
    const client = getAxiosClient();
    const navigate = useNavigate();

    // Завантаження даних
    useEffect(() => {
        if (authData.role === 'FARMER' || authData.role === 'ADMIN') {
            fetchData();
        } else {
            navigate('/');
        }
    }, [authData.userId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Товари
            const prodRes = await client.get('/api/products');
            const myProds = prodRes.data.filter(p => p.ownerId === authData.userId || p.user?.userId === authData.userId);
            setMyProducts(myProds);

            // 2. Вхідні Замовлення (нове)
            const ordersRes = await client.get('/api/orders/incoming');
            setIncomingOrders(ordersRes.data);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Функція зміни статусу
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await client.put(`/api/orders/${orderId}/status`, JSON.stringify(newStatus), {
                headers: { 'Content-Type': 'application/json' }
            });
            toast.success(`Статус замовлення #${orderId} оновлено!`);
            fetchData(); // Оновити таблицю
        } catch (error) {
            toast.error("Помилка оновлення статусу");
        }
    };

    // Видалення товару
    const handleDeleteProduct = async (id) => {
        if(!window.confirm("Видалити товар?")) return;
        try {
            await client.delete(`/api/products/${id}`);
            toast.success("Товар видалено!");
            fetchData();
        } catch (error) { toast.error("Помилка видалення"); }
    };

    if (isLoading) return <div className="text-center py-20">Завантаження панелі...</div>;

    return (
        <div className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">👨‍🌾 Панель Фермера</h1>

            {/* --- БЛОК 1: ВХІДНІ ЗАМОВЛЕННЯ --- */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                    📦 Вхідні замовлення
                    <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full">{incomingOrders.length}</span>
                </h2>

                {incomingOrders.length === 0 ? (
                    <div className="p-6 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                        Поки немає нових замовлень.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-200">
                        <table className="w-full text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Дата</th>
                                <th className="p-4">Адреса</th>
                                <th className="p-4">Сума</th>
                                <th className="p-4">Статус</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {incomingOrders.map(order => (
                                <tr key={order.orderId} className="hover:bg-gray-50">
                                    <td className="p-4 font-bold">#{order.orderId}</td>
                                    <td className="p-4 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="p-4 text-sm">{order.deliveryAddress}</td>
                                    <td className="p-4 font-bold text-green-600">{order.totalAmount} грн</td>
                                    <td className="p-4">
                                        <select
                                            value={order.deliveryStatus || 'IN_PROGRESS'}
                                            onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                            className={`border rounded px-2 py-1 text-sm font-bold cursor-pointer outline-none
                                                    ${order.deliveryStatus === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}
                                                `}
                                        >
                                            <option value="IN_PROGRESS">🟡 В обробці</option>
                                            <option value="COMPLETED">🟢 Виконано</option>
                                            <option value="CANCELLED">🔴 Скасовано</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- БЛОК 2: МОЇ ТОВАРИ --- */}
            <div className="flex justify-between items-center mb-6 border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-700">🍏 Мої товари</h2>
                <Link to="/farmer/add-product" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold shadow transition">
                    + Додати Товар
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {myProducts.map(product => (
                    <div key={product.productId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <img src={product.image || 'https://placehold.co/300x200'} alt={product.name} className="h-40 w-full object-cover"/>
                        <div className="p-4 flex-grow">
                            <h3 className="font-bold">{product.name}</h3>
                            <p className="text-green-600 font-bold text-sm">{product.price} грн</p>
                        </div>
                        <div className="flex border-t bg-gray-50">
                            <Link to={`/farmer/edit-product/${product.productId}`} className="flex-1 py-2 text-center text-blue-600 text-sm font-bold hover:bg-blue-50">
                                Змінити
                            </Link>
                            <button onClick={() => handleDeleteProduct(product.productId)} className="flex-1 py-2 text-center text-red-600 text-sm font-bold hover:bg-red-50">
                                Видалити
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FarmerDashboard;