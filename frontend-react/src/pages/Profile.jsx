import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getAxiosClient } from '../api/axiosClient'; // <-- Клієнт для захищених запитів
import toast from 'react-hot-toast';

// === КОМПОНЕНТ ОДНОГО ЗАМОВЛЕННЯ ===
// УВАГА: У реальності цей компонент повинен використовувати API для видалення
const OrderItem = ({ order, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Обробка видалення з підтвердженням
    const handleDelete = (e) => {
        e.stopPropagation();
        // Використовуємо кастомний діалог, оскільки window.confirm не рекомендовано
        if (window.confirm(`Видалити замовлення #${order.id}? Ця дія незворотна!`)) {
            onDelete(order.id); // Викликаємо функцію з контролера
        }
    };

    return (
        <li className="border rounded-xl overflow-hidden bg-white transition hover:shadow-md group">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
            >
                <div>
                    <p className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        Замовлення #{order.id}
                        <span className="text-xs text-gray-400">{isOpen ? '▲' : '▼'}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        {order.date} • <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs font-bold uppercase">Виконано</span>
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="block text-2xl font-bold text-green-600">{order.total} грн</span>

                    <button
                        onClick={handleDelete}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"
                        title="Видалити це замовлення"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="p-5 border-t border-gray-200 bg-white">
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Придбані товари:</h4>
                    {order.items && order.items.length > 0 ? (
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover border" />
                                        <div><p className="text-sm font-bold text-gray-800">{item.name}</p><p className="text-xs text-gray-500">{item.price} грн / {item.unit}</p></div>
                                    </div>
                                    <div className="text-right text-sm"><span className="font-bold">x{item.quantity}</span><span className="ml-3 text-green-600 font-bold">{item.price * item.quantity} грн</span></div>
                                </div>
                            ))}
                        </div>
                    ) : (<p className="text-sm text-gray-400 italic">Деталі відсутні</p>)}
                </div>
            )}
        </li>
    );
};

// ----------------------------------------------------------------------
// 💡 ГОЛОВНИЙ КОМПОНЕНТ PROFILE
// ----------------------------------------------------------------------
const Profile = () => {
    const { user, logout, authData, fetchUserProfile, isLoading: isAuthLoading } = useUser(); // Отримуємо функції та дані
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const client = getAxiosClient();

    // Локальний стан форми (копія DTO користувача)
    const [formData, setFormData] = useState({
        userId: null, firstName: '', lastName: '', numberPhone: '', email: '',
        // Кастомні поля, які не зберігаються в БД, але можуть бути в userProfile DTO
        bannerColor: '#10b981', bannerImage: '', cardColor: '#ffffff', pageColor: '#f9fafb',
        orders: [], wishlist: []
    });

    // 1. Ініціалізація форми даними з контексту (після завантаження)
    useEffect(() => {
        if (isAuthLoading) return;
        if (!user) {
            navigate('/login');
        } else {
            // Копіюємо поля з DTO user (firstName, lastName, email)
            setFormData({
                userId: user.userId || authData.userId,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                numberPhone: user.numberPhone || '',
                // Кастомні поля, яких немає в DTO бекенду, але є в мок-даних
                bannerColor: user.bannerColor || '#10b981',
                bannerImage: user.bannerImage || '',
                cardColor: user.cardColor || '#ffffff',
                pageColor: user.pageColor || '#f9fafb',
                orders: user.orders || [],
                wishlist: user.wishlist || []
            });
        }
    }, [user, navigate, isAuthLoading]);

    // 2. Обробка вводу
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // 3. ЗБЕРЕЖЕННЯ ПРОФІЛЮ (API PUT-ЗАПИТ)
    const handleSave = async () => {
        setIsDataLoading(true);
        try {
            const userId = authData.userId;

            // Створюємо DTO для PUT-запиту, видаляючи зайві поля
            const updateDto = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                numberPhone: formData.numberPhone,
                // Пароль тут не передаємо, оскільки це PUT-профілю
            };

            // PUT /api/users/{userId}
            await client.put(`/users/${userId}`, updateDto);

            // Оновлюємо локальний стейт профілю (завантажуємо DTO заново)
            await fetchUserProfile(authData.token);

            toast.success('Профіль оновлено успішно!');
            setIsEditing(false);

        } catch (error) {
            toast.error('Не вдалося оновити профіль. Перевірте email.');
            console.error("Profile update error:", error);
        } finally {
            setIsDataLoading(false);
        }
    };

    // 4. ФУНКЦІЯ ВИДАЛЕННЯ ЗАМОВЛЕННЯ (API DELETE)
    const deleteOrder = async (orderId) => {
        try {
            // DELETE /api/orders/{orderId}
            await client.delete(`/orders/${orderId}`);
            toast.success('Замовлення видалено!');

            // Оновлюємо профіль, щоб оновилась історія замовлень
            await fetchUserProfile(authData.token);

        } catch (error) {
            toast.error("Не вдалося видалити замовлення.");
            console.error("Order deletion error:", error);
        }
    };

    // 5. ФУНКЦІЯ ОЧИЩЕННЯ ІСТОРІЇ (TODO: Потрібен окремий ендпоінт на бекенді)
    const handleClearHistory = () => {
        if (window.confirm("Ви впевнені, що хочете видалити ВСЮ історію замовлень?")) {
            // У реальності тут має бути запит DELETE /api/orders/user/{userId}
            toast.error('Історія замовлень очищена (мок-логіка).');
            // Оновлюємо локальний стан, поки немає API
            setFormData(prev => ({...prev, orders: []}));
        }
    };


    const handleCancel = () => {
        // Відновлюємо форму з оригінальних даних
        setFormData({
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            numberPhone: user.numberPhone,
            bannerColor: user.bannerColor || '#10b981',
            bannerImage: user.bannerImage || '',
            cardColor: user.cardColor || '#ffffff',
            pageColor: user.pageColor || '#f9fafb',
            orders: user.orders,
            wishlist: user.wishlist
        });
        setIsEditing(false);
    };

    // ---------------------------------------------------

    if (isAuthLoading || !user) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;

    const currentCardColor = isEditing ? formData.cardColor : (user.cardColor || '#ffffff');
    const currentPageColor = isEditing ? formData.pageColor : (user.pageColor || '#f9fafb');

    return (
        <div className="min-h-[calc(100vh-80px)] py-8 transition-colors duration-500" style={{ backgroundColor: currentPageColor }}>
            <div className="container mx-auto px-4">
                <div className="rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-200 transition-colors duration-500" style={{ backgroundColor: currentCardColor }}>

                    {/* БАНЕР */}
                    <div className="h-48 md:h-64 w-full relative bg-cover bg-center transition-all duration-500"
                         style={{ backgroundColor: formData.bannerColor, backgroundImage: formData.bannerImage ? `url(${formData.bannerImage})` : 'none' }}>
                        {formData.bannerImage && <div className="absolute inset-0 bg-black/20"></div>}
                    </div>

                    <div className="px-6 md:px-10 pb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 md:-mt-20 mb-6 gap-6 relative z-10">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
                                {/* user.firstName - тепер DTO поле */}
                                <div className="w-full h-full bg-green-100 text-green-600 flex items-center justify-center text-5xl font-bold">{user.firstName.charAt(0).toUpperCase()}</div>
                            </div>
                            {!isEditing && (
                                <div className="text-center md:text-left mb-2">
                                    <h1 className="text-3xl font-black text-gray-800">{user.firstName} {user.lastName}</h1>
                                    <p className="text-gray-500 font-medium">{user.email}</p>
                                </div>
                            )}
                            <div className="ml-auto">
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2">✏️ Редагувати</button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleSave}
                                            disabled={isDataLoading}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold transition shadow-lg disabled:bg-gray-400"
                                        >
                                            {isDataLoading ? 'Збереження...' : 'Зберегти'}
                                        </button>
                                        <button onClick={handleCancel} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-xl font-bold transition">Скасувати</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/80 p-6 rounded-2xl border border-gray-200 animate-fadeIn backdrop-blur-sm">
                                <div className="space-y-5">
                                    <h3 className="font-bold text-gray-700 border-b pb-2">🎨 Кастомізація (Мок)</h3>
                                    {/* Ці поля залишаються мок-даними, оскільки їх немає на бекенді */}
                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"><label className="text-sm font-bold text-gray-600">Фон сторінки</label><input type="color" name="pageColor" value={formData.pageColor} onChange={handleChange} className="w-10 h-10 p-1 rounded cursor-pointer border-none"/></div>
                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"><label className="text-sm font-bold text-gray-600">Фон картки</label><input type="color" name="cardColor" value={formData.cardColor} onChange={handleChange} className="w-10 h-10 p-1 rounded cursor-pointer border-none"/></div>
                                    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"><label className="text-sm font-bold text-gray-600">Колір банера</label><input type="color" name="bannerColor" value={formData.bannerColor} onChange={handleChange} className="w-10 h-10 p-1 rounded cursor-pointer border-none"/></div>
                                    <div><label className="text-xs text-gray-500 font-bold uppercase">URL Банера</label><input type="text" name="bannerImage" value={formData.bannerImage} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-white"/></div>
                                    <div><label className="text-xs text-gray-500 font-bold uppercase">URL Аватарки</label><input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-white"/></div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-bold text-gray-700 border-b pb-2">👤 Дані (API)</h3>
                                    <div><label className="text-xs text-gray-500 font-bold uppercase">Ім'я</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-white"/></div>
                                    <div><label className="text-xs text-gray-500 font-bold uppercase">Прізвище</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-white"/></div>
                                    <div><label className="text-xs text-gray-500 font-bold uppercase">Телефон</label><input type="text" name="numberPhone" value={formData.numberPhone} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-white"/></div>
                                    {/* Email не можна редагувати через профіль PUT */}
                                    <div><label className="text-xs text-gray-500 font-bold uppercase">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-gray-200 cursor-not-allowed" disabled/></div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                                <div className="md:col-span-1 space-y-6">
                                    <div className="bg-gray-50/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-200">
                                        <h4 className="font-bold text-gray-700 mb-4">Контактна інформація</h4>
                                        <div className="space-y-3">
                                            <div><p className="text-xs text-gray-400 uppercase">Телефон</p><p className="font-medium text-gray-800">{user.numberPhone || '—'}</p></div>
                                            <div><p className="text-xs text-gray-400 uppercase">Роль</p><p className="font-medium text-red-600">{authData.role || '—'}</p></div>
                                        </div>
                                    </div>
                                    <button onClick={() => { logout(); navigate('/'); }} className="w-full border border-red-200 text-red-500 hover:bg-red-50 font-bold py-3 rounded-xl transition">Вийти з акаунту</button>
                                </div>

                                <div className="md:col-span-2">
                                    {/* Заголовок з кнопкою "Очистити все" */}
                                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                                        <h3 className="text-xl font-bold text-gray-800">Історія замовлень</h3>
                                        {user.orders && user.orders.length > 0 && (
                                            <button
                                                onClick={handleClearHistory}
                                                className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition font-bold flex items-center gap-1"
                                            >
                                                🗑 Очистити все (Мок)
                                            </button>
                                        )}
                                    </div>

                                    {user.orders && user.orders.length > 0 ? (
                                        <ul className="space-y-4">
                                            {/* Використовуємо дані з formData.orders (мок-дані) */}
                                            {formData.orders.map(order => (
                                                <OrderItem key={order.id} order={order} onDelete={deleteOrder} />
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                                            <p className="text-lg">Історія замовлень порожня (Мок)</p>
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