import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  // Дістаємо дані та функції з нашого "Мозку"
  const { cartItems, removeFromCart, addToCart, getCartTotal } = useCart();

  // Якщо кошик порожній, показуємо гарне повідомлення
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ваш кошик порожній 😕</h2>
        <p className="text-gray-600 mb-8">Здається, ви ще нічого не додали. Саме час це виправити!</p>
        <Link 
          to="/products" 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300"
        >
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Оформлення замовлення</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* --- ЛІВА ЧАСТИНА: Список товарів --- */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Заголовки таблиці (тільки для великих екранів) */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b font-semibold text-gray-600">
              <div className="col-span-6">Товар</div>
              <div className="col-span-2 text-center">Ціна</div>
              <div className="col-span-2 text-center">Кількість</div>
              <div className="col-span-2 text-center">Сума</div>
            </div>

            {/* Список товарів */}
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border-b last:border-b-0 hover:bg-gray-50 transition">
                
                {/* Фото та назва */}
                <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.unit}</p>
                    {/* Кнопка видалити (мобільна версія і десктоп) */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-sm hover:text-red-700 mt-1 flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Видалити
                    </button>
                  </div>
                </div>

                {/* Ціна за одиницю */}
                <div className="col-span-1 md:col-span-2 text-left md:text-center font-medium text-gray-600">
                  {item.price} грн
                </div>

                {/* Кількість (+ логіка) */}
                <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md font-bold text-gray-700">
                    {item.quantity}
                  </span>
                  {/* Кнопка додати ще один такий самий товар */}
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition"
                  >
                    +
                  </button>
                </div>

                {/* Загальна сума за цей товар */}
                <div className="col-span-1 md:col-span-2 text-left md:text-center font-bold text-green-600 text-lg">
                  {item.price * item.quantity} грн
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- ПРАВА ЧАСТИНА: Підсумок --- */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Разом</h3>
            
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Вартість товарів:</span>
              <span>{getCartTotal()} грн</span>
            </div>
            <div className="flex justify-between mb-4 text-gray-600">
              <span>Доставка:</span>
              <span className="text-green-600 font-medium">Безкоштовно</span>
            </div>
            
            <div className="border-t pt-4 flex justify-between items-center mb-6">
              <span className="text-xl font-bold">До сплати:</span>
              <span className="text-2xl font-bold text-green-600">{getCartTotal()} грн</span>
            </div>

            <Link to="/checkout" 
            className="block w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition duration-300 shadow-lg text-center">
            Оформити Замовлення
            </Link>

            <p className="text-xs text-gray-400 text-center mt-4">
              Натискаючи кнопку, ви погоджуєтесь з умовами використання.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;