import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getAxiosClient } from '../api/axiosClient';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const FarmerDashboard = () => {
    const { authData } = useUser();
    const [myProducts, setMyProducts] = useState([]);
    const [incomingOrders, setIncomingOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Стейт для відкритих замовлень (щоб знати, яке ID розгорнуто)
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const client = getAxiosClient();
    const navigate = useNavigate();

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
            const prodRes = await client.get('/api/products');
            const myProds = prodRes.data.filter(p => p.ownerId === authData.userId || p.user?.userId === authData.userId);
            setMyProducts(myProds);

            const ordersRes = await client.get('/api/orders/incoming');
            setIncomingOrders(ordersRes.data);
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
            toast.success(`Статус замовлення #${orderId} оновлено!`);
            fetchData();
        } catch (error) {
            toast.error("Помилка оновлення статусу");
        }
    };

    const handleDeleteProduct = async (id) => {
        if(!window.confirm("Видалити товар?")) return;
        try {
            await client.delete(`/api/products/${id}`);
            toast.success("Товар видалено!");
            fetchData();
        } catch (error) { toast.error("Помилка видалення"); }
    };

    // Перемикач розгортання
    const toggleOrderDetails = (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null); // Закрити якщо вже відкрито
        } else {
            setExpandedOrderId(orderId);
        }
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
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Дата</th>
                                <th className="p-4">Клієнт / Адреса</th>
                                <th className="p-4">Сума</th>
                                <th className="p-4">Статус</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                            {incomingOrders.map(order => (
                                <React.Fragment key={order.orderId}>
                                    {/* Основний рядок */}
                                    <tr
                                        className={`hover:bg-gray-50 cursor-pointer transition ${expandedOrderId === order.orderId ? 'bg-blue-50' : ''}`}
                                        onClick={() => toggleOrderDetails(order.orderId)}
                                    >
                                        <td className="p-4 font-bold">#{order.orderId}</td>
                                        <td className="p-4 text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="p-4 text-sm">
                                            <div className="font-bold text-gray-800">{order.user?.firstName} {order.user?.lastName}</div>
                                            <div className="text-gray-500 text-xs">{order.deliveryAddress}</div>
                                            <div className="text-gray-400 text-xs">{order.user?.numberPhone}</div>
                                        </td>
                                        <td className="p-4 font-bold text-green-600">{order.totalAmount} грн</td>
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
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
                                        <td className="p-4 text-center text-gray-400">
                                            {expandedOrderId === order.orderId ? '▲' : '▼'}
                                        </td>
                                    </tr>

                                    {/* Розгорнутий рядок (Деталі) */}
                                    {expandedOrderId === order.orderId && (
                                        <tr className="bg-blue-50/50 animate-fadeIn">
                                            <td colSpan="6" className="p-4 pt-0">
                                                <div className="bg-white rounded-lg border border-blue-100 p-4 shadow-sm ml-4 mr-4 mb-2">
                                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 border-b pb-2">Список товарів у замовленні:</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {order.orderItems && order.orderItems.map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg border border-gray-100">
                                                                <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                                                                    {item.product?.image ? (
                                                                        <img src={item.product.image} className="w-full h-full object-cover" alt={item.product.name}/>
                                                                    ) : (<div className="flex items-center justify-center h-full text-xs text-gray-400">IMG</div>)}
                                                                </div>
                                                                <div className="flex-grow">
                                                                    <div className="font-bold text-sm text-gray-800">{item.product?.name}</div>
                                                                    <div className="text-xs text-gray-500">{item.price} грн / {item.product?.unit || 'од'}</div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-bold text-blue-600">x{item.quantity}</div>
                                                                    <div className="text-xs font-bold text-gray-700">{(item.price * item.quantity).toFixed(2)}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
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
                    <div key={product.productId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition">
                        <div className="h-40 w-full relative overflow-hidden">
                            <img src={product.image || 'https://placehold.co/300x200'} alt={product.name} className="h-full w-full object-cover transform group-hover:scale-105 transition duration-500"/>
                        </div>
                        <div className="p-4 flex-grow">
                            <h3 className="font-bold text-gray-800">{product.name}</h3>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-green-600 font-bold text-sm">{product.price} грн</p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.inStock ? 'Є в наявності' : 'Немає'}
                                </span>
                            </div>
                        </div>
                        <div className="flex border-t bg-gray-50">
                            <Link to={`/farmer/edit-product/${product.productId}`} className="flex-1 py-2 text-center text-blue-600 text-sm font-bold hover:bg-blue-50 transition border-r border-gray-200">
                                Змінити
                            </Link>
                            <button onClick={() => handleDeleteProduct(product.productId)} className="flex-1 py-2 text-center text-red-600 text-sm font-bold hover:bg-red-50 transition">
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