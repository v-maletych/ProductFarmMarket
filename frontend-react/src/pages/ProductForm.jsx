import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAxiosClient } from '../api/axiosClient';
import toast from 'react-hot-toast';

const ProductForm = () => {
    const { id } = useParams(); // Якщо є id - це редагування
    const navigate = useNavigate();
    const client = getAxiosClient();
    const isEditMode = !!id;

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        inStock: true,
        category: null, // Об'єкт або ID
        unit: 'кг' // Додайте поле unit в модель Product на бекенді, якщо його немає, або ігноруйте
    });

    useEffect(() => {
        // Завантаження категорій
        client.get('/api/categories').then(res => setCategories(res.data));

        // Якщо редагування - завантажуємо дані товару
        if (isEditMode) {
            client.get(`/api/products/${id}`).then(res => {
                const p = res.data;
                setFormData({
                    name: p.name,
                    description: p.description,
                    price: p.price,
                    inStock: p.inStock,
                    category: p.categoryId, // Або p.category.categoryId залежно від DTO
                    unit: p.unit || 'кг'
                });
            });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Формуємо об'єкт для відправки
            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                inStock: formData.inStock,
                // Бекенд очікує об'єкт Category
                category: { categoryId: formData.category }
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
            console.error(error);
            toast.error("Помилка збереження.");
        }
    };

    return (
        <div className="container mx-auto px-4 py-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Редагувати Товар' : 'Новий Товар'}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-4">

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

                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition">
                    {isEditMode ? 'Зберегти Зміни' : 'Створити Товар'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;