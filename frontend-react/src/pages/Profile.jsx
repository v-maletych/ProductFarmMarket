import React, {useState, useEffect} from 'react';
import {useUser} from '../context/UserContext';
import {useNavigate} from 'react-router-dom';
import {getAxiosClient} from '../api/axiosClient';
import toast from 'react-hot-toast';

const OrderItem = ({order}) => {
    const [isOpen, setIsOpen] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <li className="border border-gray-100 rounded-2xl overflow-hidden bg-white transition hover:shadow-lg group mb-4">
            <div onClick={() => setIsOpen(!isOpen)}
                 className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer bg-white hover:bg-gray-50 transition duration-300">
                <div>
                    <div className="flex items-center gap-3">
                        <div
                            className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                            📦
                        </div>
                        <div>
                            <p className="font-bold text-gray-800 text-lg">Замовлення #{order.orderId}</p>
                            <span
                                className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${order.deliveryStatus === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                {order.deliveryStatus === 'IN_PROGRESS' ? 'В обробці' :
                                    order.deliveryStatus === 'COMPLETED' ? 'Виконано' :
                                        order.deliveryStatus === 'CANCELLED' ? 'Скасовано' : order.deliveryStatus}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="block text-xs text-gray-400 font-bold uppercase tracking-wide">Сума</span>
                        <span className="block text-xl font-bold text-gray-900">
                            {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'} <span
                            className="text-sm font-normal text-gray-500">грн</span>
                        </span>
                    </div>
                    <div
                        className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-green-50 text-green-600' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                             fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 animate-fadeIn">
                    <div
                        className="mb-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
                        <div className="mt-1 text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Адреса
                                доставки</h4>
                            <p className="text-sm font-medium text-gray-700">{order.deliveryAddress || 'Самовивіз / Не вказана'}</p>
                        </div>
                    </div>

                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 pl-1">🛒 Товари в
                        чеку</h4>

                    {order.orderItems && order.orderItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {order.orderItems.map((item, index) => (
                                <div key={index}
                                     className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                    <div
                                        className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                        {item.product && item.product.image ? (
                                            <img src={item.product.image} alt={item.product.name}
                                                 className="w-full h-full object-cover"/>
                                        ) : (
                                            <div
                                                className="w-full h-full flex items-center justify-center text-gray-300 text-xs">📷</div>
                                        )}
                                    </div>

                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-bold text-gray-800 truncate">
                                            {item.product ? item.product.name : 'Видалений товар'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.price} грн / {item.product?.unit || 'од'}
                                        </p>
                                    </div>

                                    <div className="text-right pl-2 border-l border-gray-100">
                                        <div className="text-xs font-bold text-gray-400">x{item.quantity}</div>
                                        <div className="text-sm font-bold text-green-600">
                                            {(item.price * item.quantity).toFixed(0)}₴
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">Деталі товарів відсутні.</p>
                    )}
                </div>
            )}
        </li>
    );
};

const getRoleDisplay = (role) => {
    switch (role) {
        case 'FARMER':
            return {text: 'Продавець (Фермер)', color: 'text-lime-600', bg: 'bg-lime-100'};
        case 'CUSTOMER':
            return {text: 'Покупець (Клієнт)', color: 'text-green-600', bg: 'bg-green-100'};
        case 'ADMIN':
            return {text: 'Адміністратор', color: 'text-red-600', bg: 'bg-red-100'};
        default:
            return {text: 'Користувач', color: 'text-gray-500', bg: 'bg-gray-100'};
    }
};

const Profile = () => {
    const {user, logout, authData, updateUserProfile, isLoading: isAuthLoading} = useUser();
    const navigate = useNavigate();
    const client = getAxiosClient();

    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', numberPhone: ''
    });

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

    const handleSave = async () => {
        setIsSaving(true);
        const success = await updateUserProfile(formData);
        setIsSaving(false);
        if (success) setIsEditing(false);
    };

    if (isAuthLoading || !user) return <div className="text-center py-20 text-gray-500">Завантаження профілю...</div>;

    const roleInfo = getRoleDisplay(authData.role);

    return (
        <div className="min-h-[calc(100vh-80px)] py-10 bg-gray-50/50">
            <div className="container mx-auto px-4 max-w-5xl">

                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
                    <div className="h-48 w-full bg-gradient-to-r from-green-400 to-emerald-600 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div
                            className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    <div className="px-8 pb-10">
                        <div
                            className="flex flex-col md:flex-row items-center md:items-end -mt-20 mb-10 gap-6 relative z-10">
                            <div
                                className="w-40 h-40 rounded-full border-[6px] border-white shadow-2xl bg-white text-green-600 flex items-center justify-center text-6xl font-black relative overflow-hidden group">
                                <div
                                    className="absolute inset-0 bg-green-50 group-hover:bg-green-100 transition duration-500"></div>
                                <span className="relative z-10">{user.firstName?.charAt(0).toUpperCase()}</span>
                            </div>
                            {!isEditing && (
                                <div className="text-center md:text-left mb-2 flex-grow">
                                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">{user.firstName} {user.lastName}</h1>
                                    <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                                        <p className="text-gray-500 font-medium flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                            </svg>
                                            {user.email}
                                        </p>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${roleInfo.bg} ${roleInfo.color}`}>
                                            {roleInfo.text}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="ml-auto">
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 hover:-translate-y-1 transition duration-300 shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                                        </svg>
                                        Редагувати
                                    </button>
                                )}
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="animate-fadeIn max-w-4xl mx-auto">
                                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                    <div
                                        className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                            ⚙️ Налаштування профілю
                                        </h3>
                                        <button onClick={() => setIsEditing(false)}
                                                className="text-gray-400 hover:text-red-500 transition">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                                 viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="relative group">
                                                <label
                                                    className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block group-focus-within:text-green-600 transition">Ім'я</label>
                                                <div className="relative">
                                                    <div
                                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                             viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd"
                                                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    </div>
                                                    <input
                                                        value={formData.firstName}
                                                        onChange={e => setFormData({
                                                            ...formData,
                                                            firstName: e.target.value
                                                        })}
                                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-green-500 block w-full pl-10 p-3 transition outline-none"
                                                        placeholder="Ваше ім'я"
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative group">
                                                <label
                                                    className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block group-focus-within:text-green-600 transition">Прізвище</label>
                                                <div className="relative">
                                                    <div
                                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                             viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd"
                                                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                                  clipRule="evenodd"/>
                                                        </svg>
                                                    </div>
                                                    <input
                                                        value={formData.lastName}
                                                        onChange={e => setFormData({
                                                            ...formData,
                                                            lastName: e.target.value
                                                        })}
                                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-green-500 block w-full pl-10 p-3 transition outline-none"
                                                        placeholder="Ваше прізвище"
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative group">
                                                <label
                                                    className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block group-focus-within:text-green-600 transition">Телефон</label>
                                                <div className="relative">
                                                    <div
                                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-500 transition">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                             viewBox="0 0 20 20" fill="currentColor">
                                                            <path
                                                                d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                                        </svg>
                                                    </div>
                                                    <input
                                                        value={formData.numberPhone}
                                                        onChange={e => setFormData({
                                                            ...formData,
                                                            numberPhone: e.target.value
                                                        })}
                                                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-lg rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white focus:border-green-500 block w-full pl-10 p-3 transition outline-none"
                                                        placeholder="+380..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="relative opacity-60">
                                                <label
                                                    className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Email
                                                    (не змінюється)</label>
                                                <div className="relative">
                                                    <div
                                                        className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                             viewBox="0 0 20 20" fill="currentColor">
                                                            <path
                                                                d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                                                            <path
                                                                d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                                                        </svg>
                                                    </div>
                                                    <input
                                                        value={user.email}
                                                        disabled
                                                        className="w-full bg-gray-100 border border-gray-200 text-gray-500 text-lg rounded-xl pl-10 p-3 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 mt-10 justify-end pt-6 border-t border-gray-100">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition"
                                            >
                                                Скасувати
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                disabled={isSaving}
                                                className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg hover:shadow-green-500/30 transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white"
                                                             xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10"
                                                                    stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor"
                                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Збереження...
                                                    </>
                                                ) : 'Зберегти зміни'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8 w-full animate-fadeIn">
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                        <h4 className="font-extrabold text-gray-800 mb-6 text-lg">Інформація</h4>

                                        <div className="space-y-5">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                         viewBox="0 0 20 20" fill="currentColor">
                                                        <path
                                                            d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Телефон</p>
                                                    <p className="font-medium text-gray-800 text-lg">{user.numberPhone || '—'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div
                                                    className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                         viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd"
                                                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Статус</p>
                                                    <p className="font-medium text-gray-800">{roleInfo.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            logout();
                                            navigate('/');
                                        }}
                                        className="w-full bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 font-bold py-4 rounded-2xl transition duration-300 flex items-center justify-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                        </svg>
                                        Вийти з акаунту
                                    </button>
                                </div>
                                <div className="lg:col-span-2">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-black text-gray-800">Історія замовлень</h3>
                                        <span
                                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{orders.length}</span>
                                    </div>

                                    {orders.length > 0 ? (
                                        <ul className="space-y-4">
                                            {orders.map(order => (
                                                <OrderItem key={order.orderId} order={order}/>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div
                                            className="flex flex-col items-center justify-center py-16 bg-white border-2 border-dashed border-gray-200 rounded-3xl text-gray-400">
                                            <div
                                                className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-3xl">🧺
                                            </div>
                                            <p className="text-lg font-medium">Історія замовлень порожня</p>
                                            <p className="text-sm">Зробіть своє перше замовлення вже сьогодні!</p>
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