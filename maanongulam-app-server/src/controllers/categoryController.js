import Category from '../models/Category.js';

// Create a new category
export const createCategory = async (req, res) => {
  const { categoryId, categoryName, categoryDescription } = req.body; // Updated variable names

  try {
    const category = new Category({ categoryId, categoryName, categoryDescription }); // Use correct field names
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories', error });
  }
};

// Get a category by categoryId
export const getCategoryById = async (req, res) => {
  const { id } = req.params; // Assuming id will contain the categoryId

  try {
    const category = await Category.findOne({ categoryId: id }); // Use findOne to search by categoryId
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    console.error('Error retrieving category:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error retrieving category', error });
  }
};

// Get a category by category name
export const getCategoryByStrCategory = async (req, res) => {
    const { categoryName } = req.params; // Parameter name
    console.log('Searching for category:', categoryName); // Log for debugging

    try {
        const categories = await Category.find({ categoryName: categoryName });
        if (categories.length === 0) return res.status(404).json({ message: 'No categories found' });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error retrieving categories:', error); // Log the error
        res.status(500).json({ message: 'Error retrieving categories', error });
    }
};

// Update a category
// Update a category
export const updateCategory = async (req, res) => {
  const { id } = req.params; // This should be the categoryId if you're using that for updates
  const { categoryName, categoryDescription } = req.body; // Use the correct variable names

  try {
    const category = await Category.findOneAndUpdate(
      { categoryId: id }, // Ensure this is the correct identifier
      { categoryName, categoryDescription },
      { new: true }
    );
    
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    console.error('Error updating category:', error); // Log the error for debugging
    res.status(400).json({ message: 'Error updating category', error });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  const { id } = req.params; // Make sure 'id' corresponds to categoryId, not MongoDB _id

  try {
    const category = await Category.findOneAndDelete({ categoryId: id });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting category:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
