import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user, toggleWishlist } = useUser(); // user (це наш DTO Profile)

    // 💡 ВИПРАВЛЕННЯ: Перевіряємо, чи товар вже лайкнутий, використовуючи productId з DTO.
    // Припускаємо, що елементи wishlist у профілі також мають поле productId.
    const isLiked = user?.wishlist?.some(p => p.productId === product.productId);

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative group">

            {/* 🔥 КНОПКА СЕРЦЯ (Абсолютне позиціонування) 🔥 */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    // product тут має бути об'єктом DTO з полями productId, name, price і т.д.
                    toggleWishlist(product);
                }}
                className="absolute top-3 right-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition transform hover:scale-110"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isLiked ? 0 : 2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            <div className="h-48 overflow-hidden relative">
                {/* 💡 ВИПРАВЛЕННЯ: Використовуємо product.productId для маршруту */}
                <Link to={`/product/${product.productId}`}>
                    <img
                        src={product.image || 'https://placehold.co/400x300'} // Додано заглушку для images
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition duration-300"></div>
                </Link>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {/* 💡 ВИПРАВЛЕННЯ: Використовуємо product.productId для маршруту */}
                    <Link to={`/product/${product.productId}`} className="hover:text-green-600 transition">
                        {product.name}
                    </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div>
                        {/* 💡 ВИПРАВЛЕННЯ: Ціна тепер double, використовуємо toFixed для округлення (якщо потрібно) */}
                        <span className="text-2xl font-bold text-green-600">{product.price?.toFixed(2) || '0.00'} ₴</span>
                        {/* Припускаємо, що unit є в DTO */}
                        <span className="text-gray-400 text-sm ml-1">/ {product.unit || 'кг'}</span>
                    </div>

                    <button
                        onClick={() => addToCart(product)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-md transition duration-300 active:scale-90"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;