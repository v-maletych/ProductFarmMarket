import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// === КОНТЕКСТИ (МОЗОК САЙТУ) ===
import { CartProvider } from './context/CartContext'; // <--- ОСЬ ЦЬОГО НЕ ВИСТАЧАЛО
import { UserProvider } from './context/UserContext';

// === КОМПОНЕНТИ ===
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

// === СТОРІНКИ ===
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import About from './pages/About.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import ProductPage from './pages/ProductPage.jsx';
import NotFound from './pages/NotFound.jsx';
import Auth from './pages/Auth.jsx';
import Profile from './pages/Profile.jsx';
import Wishlist from './pages/Wishlist.jsx';

function App() {
  return (
    <UserProvider> {/* 1. Шар користувача */}
      <CartProvider> {/* 2. Шар кошика */}
        
        <div className="flex flex-col min-h-screen font-sans text-gray-900">
          <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
          
          <Header />

          <main className="flex-grow">
            <Routes>
              {/* Головна */}
              <Route path="/" element={<Home />} />
              
              {/* Каталог (два варіанти: загальний і по категорії) */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/:categoryName" element={<Products />} />
              
              {/* Товар */}
              <Route path="/product/:id" element={<ProductPage />} />
              
              {/* Інфо */}
              <Route path="/about" element={<About />} />
              
              {/* Кошик та Оплата */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Авторизація */}
              <Route path="/login" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Помилка 404 */}
              <Route path="*" element={<NotFound />} />
              {/* Сторінка бажань */}
              <Route path="/wishlist" element={<Wishlist />} /> {/* <--- Додай цей рядок */}
            </Routes>
          </main>

          <Footer />
        </div>

      </CartProvider>
    </UserProvider>
  );
}

export default App;