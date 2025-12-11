import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAxiosClient } from '../api/axiosClient';
import toast from 'react-hot-toast';

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const client = getAxiosClient();
    const isEditMode = !!id;

    const [categories, setCategories] = useState([]);
    const [isUploading, setIsUploading] = useState(false); // Стан завантаження фото

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        inStock: true,
        category: '',
        image: '' // Поле для URL картинки
    });

    useEffect(() => {
        client.get('/api/categories').then(res => setCategories(res.data));

        if (isEditMode) {
            client.get(`/api/products/${id}`).then(res => {
                const p = res.data;
                setFormData({
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    inStock: p.inStock,
                    category: p.categoryId,
                    image: p.image || '' // Завантажуємо існуюче фото
                });
            });
        }
    }, [id]);

    // 🔥 ФУНКЦІЯ ЗАВАНТАЖЕННЯ ФОТО 🔥
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        setIsUploading(true);
        try {
            // Відправляємо файл на наш новий контролер
            const res = await client.post('/api/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Сервер повертає URL (наприклад, /images/uuid.jpg)
            setFormData(prev => ({ ...prev, image: res.data }));
            toast.success("Фото завантажено!");
        } catch (error) {
            console.error(error);
            toast.error("Помилка завантаження фото");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                inStock: formData.inStock,
                category: { categoryId: formData.category },
                image: formData.image // Відправляємо URL фото разом з товаром
            };

            if (isEditMode) {
                await client.put(`/api/products/${id}`, payload);
                toast.success("Товар оновлено!");
            } else {
                await client.post('/api/products', payload);
                toast.success("Товар створено!");
            }
            navigate('/farmer-dashboard');
        } catch (error) {
            toast.error("Помилка збереження.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Редагувати Товар' : 'Новий Товар'}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-4">

                {/* --- БЛОК ЗАВАНТАЖЕННЯ ФОТО --- */}
                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Фото товару</label>

                    <div className="flex items-center gap-4">
                        {/* Прев'ю */}
                        <div className="w-24 h-24 border rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Немає фото</div>
                            )}
                        </div>

                        {/* Кнопка */}
                        <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-100 transition">
                            {isUploading ? 'Завантаження...' : 'Обрати файл'}
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
                    </div>
                </div>
                {/* --------------------------------- */}

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Назва</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-3 rounded-lg" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Опис</label>
                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-3 rounded-lg h-24" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Ціна (грн)</label>
                        <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border p-3 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Категорія</label>
                        <select required value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border p-3 rounded-lg">
                            <option value="">Оберіть категорію</option>
                            {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                    <input type="checkbox" id="stock" checked={formData.inStock} onChange={e => setFormData({...formData, inStock: e.target.checked})} className="w-5 h-5 text-green-600" />
                    <label htmlFor="stock" className="text-gray-700 font-medium">Товар в наявності</label>
                </div>

                <button type="submit" disabled={isUploading} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition disabled:bg-gray-400">
                    {isEditMode ? 'Зберегти Зміни' : 'Створити Товар'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;