import React from 'react';
import {Link} from 'react-router-dom';

const CategoryCard = ({category}) => (
    <Link
        to={category.link}
        className="group relative h-64 overflow-hidden rounded-2xl shadow-lg cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl"
    >
        <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition duration-300"
        ></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white text-center drop-shadow-md tracking-wide">
                {category.name}
            </h3>
            <span
                className="mt-3 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300">
        Переглянути
      </span>
        </div>
    </Link>
);

export default CategoryCard;