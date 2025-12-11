import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getAxiosClient } from '../api/axiosClient';
import toast from 'react-hot-toast';

// === КОМПОНЕНТ ОДНОГО ЗАМОВЛЕННЯ ===
const OrderItem = ({ order }) => {
    const [isOpen, setIsOpen] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <li className="border rounded-xl overflow-hidden bg-white transition hover:shadow-md group mb-4">
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div>
                    <p className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        Замовлення #{order.orderId}
                        <span className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        {formatDate(order.orderDate)} •
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold uppercase ${order.deliveryStatus === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {order.deliveryStatus || 'В обробці'}
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="block text-2xl font-bold text-green-600">
                        {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'} грн
                    </span>
                </div>
            </div>
            {isOpen && (
                <div className="p-5 border-t border-gray-200 bg-white">
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Деталі доставки:</h4>
                    <p className="text-sm text-gray-600 mb-2">Адреса: {order.deliveryAddress || 'Не вказана'}</p>
                </div>
            )}
        </li>
    );
};

const getRoleDisplay = (role) => {
    switch (role) {
        case 'FARMER': return { text: 'Продавець (Фермер)', color: 'text-lime-600' };
        case 'CUSTOMER': return { text: 'Покупець (Клієнт)', color: 'text-green-600' };
        case 'ADMIN': return { text: 'Адміністратор', color: 'text-red-600' };
        default: return { text: 'Користувач', color: 'text-gray-500' };
    }
};

const Profile = () => {
    const { user, logout, authData, updateUserProfile, isLoading: isAuthLoading } = useUser();
    const navigate = useNavigate();
    const client = getAxiosClient();

    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // 🔥 Відновлено
    const [isSaving, setIsSaving] = useState(false);

    // Форма редагування
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        numberPhone: ''
    });

    // 1. Завантаження даних при старті
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                numberPhone: user.numberPhone || ''
            });
        }
        if (authData.isAuthenticated) {
            client.get('/api/orders/my')
                .then(res => setOrders(res.data))
                .catch(err => console.error("Історія не завантажилась", err));
        }
    }, [user, authData.isAuthenticated]);

    // 2. Обробка збереження
    const handleSave = async () => {
        setIsSaving(true);
        const success = await updateUserProfile(formData); // Ця функція є в UserContext
        setIsSaving(false);
        if (success) setIsEditing(false);
    };

    if (isAuthLoading || !user) return <div className="text-center py-20">Завантаження...</div>;

    const roleInfo = getRoleDisplay(authData.role);

    return (
        <div className="min-h-[calc(100vh-80px)] py-8 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-200 bg-white">

                    {/* Зелений банер */}
                    <div className="h-48 bg-green-500 w-full relative"></div>

                    <div className="px-6 md:px-10 pb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6 gap-6">
                            {/* Додано bg-white, z-10 та relative */}
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white text-green-600 flex items-center justify-center text-5xl font-bold z-10 relative">
                                {user.firstName?.charAt(0).toUpperCase()}
                            </div>

                            {/* Заголовок профілю (коли не редагуємо) */}
                            {!isEditing && (
                                <div className="text-center md:text-left mb-2">
                                    <h1 className="text-3xl font-black text-gray-800">{user.firstName} {user.lastName}</h1>
                                    <p className="text-gray-500 font-medium">{user.email}</p>
                                </div>
                            )}

                            <div className="ml-auto">
                                {!isEditing && (
                                    <button onClick={() => setIsEditing(true)} className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition">
                                        ✏️ Редагувати
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 🔥 ФОРМА РЕДАГУВАННЯ 🔥 */}
                        {isEditing ? (
                            <div className="bg-gray-50 p-6 rounded-2xl border border-green-200 mb-8 max-w-2xl mx-auto">
                                <h3 className="font-bold text-lg mb-4 text-gray-700">Редагування профілю</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Ім'я</label>
                                        <input
                                            value={formData.firstName}
                                            onChange={e => setFormData({...formData, firstName: e.target.value})}
                                            className="w-full border p-2 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Прізвище</label>
                                        <input
                                            value={formData.lastName}
                                            onChange={e => setFormData({...formData, lastName: e.target.value})}
                                            className="w-full border p-2 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Телефон</label>
                                        <input
                                            value={formData.numberPhone}
                                            onChange={e => setFormData({...formData, numberPhone: e.target.value})}
                                            className="w-full border p-2 rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6 justify-end">
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition">Скасувати</button>
                                    <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition">
                                        {isSaving ? 'Збереження...' : 'Зберегти зміни'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Звичайний вигляд (коли не редагуємо)
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full">
                                <div className="md:col-span-1 space-y-6">
                                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                                        <h4 className="font-bold text-gray-700 mb-4">Контактна інформація</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">Телефон</p>
                                                <p className="font-medium text-gray-800">{user.numberPhone || '—'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase">Роль</p>
                                                <p className={`font-medium ${roleInfo.color}`}>{roleInfo.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => { logout(); navigate('/'); }} className="w-full border border-red-200 text-red-500 hover:bg-red-50 font-bold py-3 rounded-xl transition">
                                        Вийти з акаунту
                                    </button>
                                </div>

                                <div className="md:col-span-2">
                                    <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Історія замовлень</h3>
                                    {orders.length > 0 ? (
                                        <ul className="space-y-4">
                                            {orders.map(order => (
                                                <OrderItem key={order.orderId} order={order} />
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                                            <p className="text-lg">Історія замовлень порожня</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;