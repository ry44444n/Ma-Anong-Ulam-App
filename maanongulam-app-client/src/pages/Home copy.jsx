// src/pages/Home.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; 
import RecipeGrid from '../components/RecipeGrid';
import SearchInput from '../components/SearchInput';
import CategoriesCarousel from '../components/CategoriesCarousel';
import RecipeDetail from '../components/RecipeDetail'; 
import CreateRecipe from './CreateRecipe'; 
import Modal from '../components/Modal'; 
import logo from '../assets/maulogo.png';
import backgroundImage from '../assets/table2.png';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate(); 
  const { recipeId } = useParams(); 
  const userId = localStorage.getItem('userId'); 

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); 

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleRecipeSelect = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleHomeClick = () => {
    setSelectedCategoryId(null); 
  };

  const handleLogout = () => {
    localStorage.removeItem('userId'); 
    navigate('/auth'); 
  };

  const handleAccountSettings = () => {
    navigate('/account-settings'); 
  };

  const handleCreateRecipeClick = () => {
    setIsModalOpen(true); // Open the modal when the button is clicked
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
      }}
    >
      <nav
        className="flex items-center justify-between p-4 bg-white shadow"
        style={{ backgroundColor: 'rgba(211, 211, 211, 0.4)' }}
      >
        <button onClick={() => window.location.reload()} className="focus:outline-none">
          <img
            src={logo} 
            alt="Ma! Anong ulam? Logo"
            className="h-32 -mt-7 -mb-5"
          />
        </button>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleCreateRecipeClick} 
            className="bg-orange-400 text-red-900 font-recia px-4 py-2 rounded hover:bg-red-900 hover:text-orange-400 transition duration-300">
            Create Recipe
          </button>

          <div className="relative">
            <button onClick={toggleDropdown} className="focus:outline-none">
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </button>
            {isDropdownOpen && (
              <ul className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-48">
                <li className="px-4 py-2 hover:bg-gray-100 transition duration-300">
                  <button onClick={() => navigate('/profile')} className="text-black">
                    My Profile
                  </button>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 transition duration-300">
                  <button onClick={handleAccountSettings} className="text-black">
                    Account Settings
                  </button>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 transition duration-300">
                  <button onClick={handleLogout} className="text-red-500">
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <section
          className="flex flex-col items-center justify-center h-64 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://source.unsplash.com/random/800x600/?food")' }}
        >
          <h2 className="text-7xl text-orange-400 font-bold font-zina">
            Discover. Delicious. Recipes.
          </h2>
          <p className="text-2xl text-red-900 font-recia">
            Is there anything specific you're craving today?
          </p>
          <SearchInput />
        </section>
        <CategoriesCarousel onCategorySelect={handleCategorySelect} />

        {recipeId ? (
          <RecipeDetail recipeId={recipeId} />
        ) : (
          <RecipeGrid
            selectedCategoryId={selectedCategoryId}
            onRecipeSelect={handleRecipeSelect}
          />
        )}
      </main>

      <footer className="bg-white p-2 text-center shadow mt-4"
      style={{ backgroundColor: 'rgba(211, 211, 211, 0.4)'}}>
        <p className="text-black">&copy; 2024 Kurimau. All rights reserved.</p>
      </footer>

      {/* Modal for Creating Recipe */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <CreateRecipe onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default Home;