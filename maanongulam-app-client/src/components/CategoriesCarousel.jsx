import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoriesCarousel = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const categoriesToShow = 5; // Number of categories to display at a time

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (categories.length - categoriesToShow + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (categories.length - categoriesToShow + 1)) % (categories.length - categoriesToShow + 1));
  };

  const handleCategoryClick = (categoryId) => {
    onCategorySelect(categoryId); // Pass the selected category ID
  };

  return (
    <div className="flex items-center justify-center my-4">
      <button onClick={handlePrev} className="text-red-900 text-2xl ">&lt;&lt;</button>
      <div className="flex overflow-hidden w-full justify-around">
        {categories.slice(currentIndex, currentIndex + categoriesToShow).map((category) => (
          <div 
            key={category.categoryId} 
            className="text-red-900 font-recia bg-white bg-opacity-30 hover:bg-opacity-80 rounded p-6 m-4 transition duration-300 cursor-pointer"
            onClick={() => handleCategoryClick(category.categoryId)} // Add onClick here
          >
            <h3 className="text-2xl font-semibold">{category.categoryName}</h3>
            {category.categoryImageUrl && (
              <img src={category.categoryImageUrl} alt={category.categoryName} className="w-full h-32 object-cover rounded mt-2" />
            )}
          </div>
        ))}
      </div>
      <button onClick={handleNext} className="text-red-900 text-2xl">&gt;&gt;</button>
    </div>
  );
};

export default CategoriesCarousel;
