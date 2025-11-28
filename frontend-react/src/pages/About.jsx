import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Секція 1: Заголовок та Місія */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-black text-gray-800 mb-6">
          Ми — це <span className="text-green-600">FarmMarket</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Ми віримо, що їжа має бути справжньою. Ніякої хімії, ніяких довгих перевезень. 
          Тільки свіжі продукти від локальних українських фермерів прямо до вашого столу.
        </p>
      </div>

      {/* Секція 2: Картинка та Історія */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="rounded-2xl overflow-hidden shadow-xl transform -rotate-2 hover:rotate-0 transition duration-500">
          <img 
            src="https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Фермер" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Наша Історія</h2>
          <p className="text-gray-600 mb-4">
            У 2020 році все почалося з маленької грядки біля дому. Ми просто хотіли годувати свою родину найкращими, натуральними продуктами — без хімії, без сумнівних постачальників, без «пофіг, і так з’їдять».
            Це швидко переросло у щось більше: ми побачили, скільки фермерів працюють чесно, але не можуть достукатися до покупців. І скільки людей хочуть якісні продукти, але не знають, кому довіряти.
            Так народилася ідея створити платформу, що об’єднає тих, хто вирощує з любов’ю, і тих, хто обирає усвідомлено.
          </p>
          <p className="text-gray-600 mb-6">
            Сьогодні FarmMarket — це екосистема, де кожен помідор має свою історію, кожне яблуко пахне справжнім садом, а не складом, а кожен покупець знає, звідки прийшов його продукт. Ми ростемо разом із нашими фермерами, підтримуємо локальні господарства та робимо натуральні продукти доступними для кожної родини.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <span className="block text-3xl font-bold text-green-600">50+</span>
              <span className="text-sm text-gray-600">Фермерів-партнерів</span>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <span className="block text-3xl font-bold text-green-600">1000+</span>
              <span className="text-sm text-gray-600">Щасливих клієнтів</span>
            </div>
          </div>
        </div>
      </div>

      {/* Секція 3: Заклик до дії */}
      <div className="bg-gray-900 rounded-3xl p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Готові скуштувати справжнє?</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Зробіть своє перше замовлення сьогодні та отримайте безкоштовну доставку.
        </p>
        <Link 
          to="/products" 
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
        >
          Перейти в Каталог
        </Link>
      </div>
    </div>
  );
};

export default About;