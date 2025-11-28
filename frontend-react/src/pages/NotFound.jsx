import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-black text-gray-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mt-4">Упс! Сторінку не знайдено.</h2>
      <p className="text-gray-600 mt-2 mb-8 max-w-md">
        Схоже, цей овоч ще не вирів, або сторінка переїхала на іншу грядку.
      </p>
      <Link 
        to="/" 
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition shadow-lg"
      >
        Повернутися на Головну
      </Link>
    </div>
  );
};

export default NotFound;