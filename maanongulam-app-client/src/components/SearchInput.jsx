import React, { useState, useContext } from 'react'; 
import { FaSearch } from 'react-icons/fa';
import { RecipeContext } from '../context/RecipeContext';
import { searchRecipes } from '../api/recipeApi';

const SearchInput = ({ onSearchTypeChange }) => { // Accept prop for search type change
  const { setRecipes } = useContext(RecipeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownVisible(e.target.value.length > 0);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await searchRecipes(searchTerm); // Use the API function

      // Check if the data is an array and has recipes
      if (Array.isArray(data) && data.length > 0) {
        setRecipes(data); // Set the entire array of recipes
      } else {
        console.error('No recipes found');
        setRecipes([]); // Clear the recipes if none are found
      }
      onSearchTypeChange(''); 
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleOptionClick = async (option) => {
    const searchQuery = option.replace(' in Recipes', '').replace(' in Users', ''); // Extract search term
    setSearchTerm(searchQuery);
    setDropdownVisible(false);

    if (option.includes('in Recipes')) {
      onSearchTypeChange('Recipes'); // Update search type to Recipes
    } else if (option.includes('in Users')) {
      onSearchTypeChange('Users'); // Update search type to Users
    }

    // Fetch recipes or users based on the selected option
    try {
      const data = await searchRecipes(searchQuery);
      if (Array.isArray(data) && data.length > 0) {
        setRecipes(data);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching:', error);
    }
  };

  const dropdownOptions = searchTerm ? [
    `${searchTerm} in Recipes`,
    `${searchTerm} in Users`
  ] : [];

  return (
    <div className="relative">
      <form onSubmit={handleSearchSubmit} className="flex mt-4 font-recia">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for recipes here..."
          className="p-4 w-full border rounded-l"
        />
        <button type="submit" className="p-4 bg-orange-400 text-white rounded-r hover:bg-red-900 transition duration-300">
          <FaSearch />
        </button>
      </form>
      {dropdownVisible && dropdownOptions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
          {dropdownOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput
