import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { getAxiosClient } from '../api/axiosClient';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user, authData } = useUser();
    const navigate = useNavigate();
    const client = getAxiosClient();

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderError, setOrderError] = useState(null);

    const [formData, setFormData] = useState({
        fullName: (user?.firstName || '') + ' ' + (user?.lastName || ''),
        email: user?.email || '',
        address: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    if (cartItems.length === 0 && !isSuccess) {
        return <div className="container mx-auto px-4 py-20 text-center"><h2 className="text-3xl font-bold">Ваш кошик порожній 😕</h2><Link to="/products" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 mt-4 inline-block">Перейти до каталогу</Link></div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'cardNumber') {
            const rawValue = value.replace(/\D/g, '');
            const truncated = rawValue.slice(0, 16);
            formattedValue = truncated.replace(/(\d{4})(?=\d)/g, '$1 ');
        }
        else if (name === 'expiry') {
            const rawValue = value.replace(/\D/g, '');
            const truncated = rawValue.slice(0, 4);
            if (truncated.length >= 3) {
                formattedValue = `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
            } else {
                formattedValue = truncated;
            }
        }
        else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        setFormData({ ...formData, [name]: formattedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOrderError(null);
        setIsProcessing(true);

        if (!authData.isAuthenticated) {
            setOrderError("Помилка: Ви не авторизовані.");
            setIsProcessing(false);
            return;
        }

        const orderDto = {
            orderItems: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            deliveryAddress: formData.address,
            totalAmount: getCartTotal(),
        };

        try {
            // ВИПРАВЛЕНО: Додано префікс /api
            await client.post('/api/orders', orderDto);

            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();

        } catch (err) {
            setOrderError(`Не вдалося оформити замовлення. ${err.response?.data?.message || err.message}`);
            toast.error("Помилка при оплаті.");
            console.error("Order submit error:", err);
            setIsProcessing(false);
        }
    };


    if (isSuccess) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="inline-block p-6 bg-green-100 rounded-full mb-6">
                    <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Дякуємо за замовлення!</h2>
                <p className="text-gray-600 mb-8">Ваше замовлення успішно прийнято в обробку. Деталі в особистому кабінеті.</p>
                <button
                    onClick={() => navigate('/profile')}
                    className="bg-gray-800 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-700 transition"
                >
                    В кабінет
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Оформлення та Оплата</h1>

            {orderError && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4 text-center">{orderError}</div>}

            <div className="bg-white shadow-lg rounded-2xl p-6 md:p-10 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Секція 1: Контакти */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="bg-green-100 text-green-600 w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
                            Дані доставки
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                required name="fullName" placeholder="ПІБ"
                                value={formData.fullName} onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                            <input
                                required type="email" name="email" placeholder="Email"
                                value={formData.email} onChange={handleChange}
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                            <input
                                required name="address" placeholder="Адреса доставки"
                                value={formData.address} onChange={handleChange}
                                className="w-full md:col-span-2 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Секція 2: Картка (Мок-поля, оскільки реальна оплата не підключається) */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <span className="bg-green-100 text-green-600 w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
                            Оплата карткою (Мок)
                        </h3>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <div className="mb-4">
                                <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Номер картки</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="text"
                                        name="cardNumber"
                                        placeholder="0000 0000 0000 0000"
                                        maxLength="19"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-300 p-3 pl-10 rounded-lg font-mono text-lg tracking-wider focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                    <svg className="w-6 h-6 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">Термін дії</label>
                                    <input
                                        required
                                        type="text"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        value={formData.expiry}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-300 p-3 rounded-lg text-center font-mono focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1 uppercase font-bold">CVV</label>
                                    <input
                                        required
                                        type="password"
                                        name="cvv"
                                        placeholder="123"
                                        maxLength="3"
                                        value={formData.cvv}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-gray-300 p-3 rounded-lg text-center font-mono focus:ring-2 focus:ring-green-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Кнопка оплати */}
                    <div className="pt-4">
                        <div className="flex justify-between items-center mb-4 font-bold text-xl">
                            <span>До сплати:</span>
                            <span>{getCartTotal()} грн</span>
                        </div>
                        <button
                            type="submit"
                            disabled={isProcessing || cartItems.length === 0}
                            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition duration-300 flex justify-center items-center
                ${(isProcessing || cartItems.length === 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 transform hover:-translate-y-1'}`}
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Обробка замовлення...
                                </>
                            ) : (
                                `Оформити замовлення за ${getCartTotal()} грн`
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-3">
                            🔒 Ваші платіжні дані надійно захищені
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Checkout;