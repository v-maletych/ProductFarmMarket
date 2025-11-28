import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true); // Перемикач Вхід/Реєстрація
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const { login, register } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLoginMode) {
      const success = login(formData.email, formData.password);
      if (success) navigate('/profile');
    } else {
      const success = register(formData.name, formData.email, formData.password);
      if (success) navigate('/profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        {/* Заголовок з перемикачем */}
        <div className="flex justify-center mb-8 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setIsLoginMode(true)}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition ${isLoginMode ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}
          >
            Вхід
          </button>
          <button 
            onClick={() => setIsLoginMode(false)}
            className={`flex-1 py-2 rounded-md text-sm font-bold transition ${!isLoginMode ? 'bg-white shadow text-green-600' : 'text-gray-500'}`}
          >
            Реєстрація
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLoginMode ? 'З поверненням! 👋' : 'Створити акаунт 🚀'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ваше ім'я</label>
              <input 
                type="text" name="name" required 
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Іван Петренко"
                onChange={handleChange}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" name="email" required 
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="you@example.com"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input 
              type="password" name="password" required 
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="••••••••"
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition shadow-lg mt-4"
          >
            {isLoginMode ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Auth;