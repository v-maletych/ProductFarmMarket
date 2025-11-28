import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

// === КОМПОНЕНТ ОДНОГО ЗАМОВЛЕННЯ ===
const OrderItem = ({ order, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Обробка видалення з підтвердженням
  const handleDelete = (e) => {
    e.stopPropagation(); // Зупиняємо клік, щоб не відкрився список товарів
    if (window.confirm(`Видалити замовлення #${order.id}?`)) {
      onDelete(order.id);
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
            
            {/* 🔥 КНОПКА ВИДАЛЕННЯ ОДНОГО ЗАМОВЛЕННЯ 🔥 */}
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

const Profile = () => {
  // 👇 Додали deleteOrder
  const { user, logout, updateUserProfile, isLoading, clearOrderHistory, deleteOrder } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', avatar: '',
    bannerColor: '', bannerImage: '', cardColor: '', pageColor: ''
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user) { navigate('/login'); } else {
      setFormData({
        name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '',
        avatar: user.avatar || '', bannerColor: user.bannerColor || '#10b981', bannerImage: user.bannerImage || '',
        cardColor: user.cardColor || '#ffffff', pageColor: user.pageColor || '#f9fafb'
      });
    }
  }, [user, navigate, isLoading]);

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  if (!user) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSave = () => { updateUserProfile(formData); setIsEditing(false); };
  
  const handleCancel = () => {
    setFormData({
      name: user.name || '', email: user.email || '', phone: user.phone || '', address: user.address || '',
      avatar: user.avatar || '', bannerColor: user.bannerColor || '#10b981', bannerImage: user.bannerImage || '',
      cardColor: user.cardColor || '#ffffff', pageColor: user.pageColor || '#f9fafb'
    });
    setIsEditing(false);
  };

  const handleClearHistory = () => {
    if (window.confirm("Ви впевнені, що хочете видалити ВСЮ історію замовлень?")) {
      clearOrderHistory();
    }
  };

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
                {formData.avatar ? <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-green-100 text-green-600 flex items-center justify-center text-5xl font-bold">{user.name.charAt(0).toUpperCase()}</div>}
              </div>
              {!isEditing && (
                <div className="text-center md:text-left mb-2">
                  <h1 className="text-3xl font-black text-gray-800">{user.name}</h1>
                  <p className="text-gray-500 font-medium">{user.email}</p>
                </div>
              )}
              <div className="ml-auto">
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg flex items-center gap-2">✏️ Редагувати</button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold transition shadow-lg">Зберегти</button>
                    <button onClick={handleCancel} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-xl font-bold transition">Скасувати</button>
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/80 p-6 rounded-2xl border border-gray-200 animate-fadeIn backdrop-blur-sm">
                 <div className="space-y-5">
                    <h3 className="font-bold text-gray-700 border-b pb-2">🎨 Кастомізація</h3>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"><label className="text-sm font-bold text-gray-600">Фон сторінки</label><input type="color" name="pageColor" value={formData.pageColor} onChange={handleChange} className="w-10 h-10 p-1 rounded cursor-pointer border-none"/></div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"><label className="text-sm font-bold text-gray-600">Фон картки</label><input type="color" name="cardColor" value={formData.cardColor} onChange={handleChange} className="w-10 h-10 p-1 rounded cursor-pointer border-none"/></div>
                    <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"><label className="text-sm font-bold text-gray-600">Колір банера</label><input type="color" name="bannerColor" value={formData.bannerColor} onChange={handleChange} className="w-10 h-10 p-1 rounded cursor-pointer border-none"/></div>
                    <div><label className="text-xs text-gray-500 font-bold uppercase">URL Банера</label><input type="text" name="bannerImage" value={formData.bannerImage} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-white"/></div>
                    <div><label className="text-xs text-gray-500 font-bold uppercase">URL Аватарки</label><input type="text" name="avatar" value={formData.avatar} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-white"/></div>
                 </div>
                 <div className="space-y-4">
                    <h3 className="font-bold text-gray-700 border-b pb-2">👤 Дані</h3>
                    <div><label className="text-xs text-gray-500 font-bold uppercase">Ім'я</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-white"/></div>
                    <div><label className="text-xs text-gray-500 font-bold uppercase">Телефон</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-white"/></div>
                    <div><label className="text-xs text-gray-500 font-bold uppercase">Адреса</label><textarea name="address" value={formData.address} onChange={handleChange} className="w-full border p-3 rounded-lg mt-1 bg-white h-24 resize-none"/></div>
                 </div>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-gray-50/80 backdrop-blur-sm p-5 rounded-2xl border border-gray-200">
                    <h4 className="font-bold text-gray-700 mb-4">Контактна інформація</h4>
                    <div className="space-y-3">
                      <div><p className="text-xs text-gray-400 uppercase">Телефон</p><p className="font-medium text-gray-800">{user.phone || '—'}</p></div>
                      <div><p className="text-xs text-gray-400 uppercase">Адреса</p><p className="font-medium text-gray-800">{user.address || '—'}</p></div>
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
                         🗑 Очистити все
                       </button>
                     )}
                   </div>

                   {user.orders && user.orders.length > 0 ? (
                      <ul className="space-y-4">
                        {user.orders.map(order => (
                          // Передаємо функцію видалення
                          <OrderItem key={order.id} order={order} onDelete={deleteOrder} />
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
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