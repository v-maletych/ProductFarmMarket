import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Увійдіть в кабінет 🔐</h2>
        <p className="text-gray-500 mb-6">Щоб бачити свої збережені товари, потрібно авторизуватися.</p>
        <Link to="/login" className="bg-green-600 text-white px-6 py-2 rounded-full font-bold">Увійти</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-gray-800 mb-8 border-b pb-4">
        ❤️ Мої бажання {user.wishlist?.length > 0 && <span className="text-gray-400 text-xl">({user.wishlist.length})</span>}
      </h1>

      {user.wishlist && user.wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {user.wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400 text-xl mb-4">Список бажань порожній 💔</p>
          <Link to="/products" className="text-green-600 font-bold hover:underline">
            Перейти до каталогу
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;