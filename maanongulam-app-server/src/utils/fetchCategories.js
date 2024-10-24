import axios from 'axios';
import mongoose from 'mongoose';
import Category from '../models/Category.js'; // Corrected import
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Use MONGO_URI from .env file
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function fetchAndStoreCategories() {
    try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
        const categories = response.data.categories;

        for (const category of categories) {
            // Check if categoryId is valid and not null
            if (category.idCategory && category.idCategory !== null) {
                // Check if category already exists
                const existingCategory = await Category.findOne({ categoryId: category.idCategory });

                if (!existingCategory) {
                    const newCategory = new Category({
                        categoryId: category.idCategory,
                        categoryName: category.strCategory,
                        categoryImageUrl: category.strCategoryThumb,
                        categoryDescription: category.strCategoryDescription,
                    });
                    await newCategory.save();
                    console.log(`Saved category: ${category.strCategory}`);
                } else {
                    console.warn(`Category already exists: ${category.strCategory}`);
                }
            } else {
                console.warn('Category with missing or invalid idCategory:', category);
            }
        }

        console.log('All valid categories processed successfully!');
    } catch (error) {
        console.error('Error fetching or storing categories data:', error);
    } finally {
        mongoose.connection.close();
    }
}

fetchAndStoreCategories();
