// src/api/facetedSearch.js
export const fetchUsersBySearchTerm = async (searchTerm) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/facetedSearch/users?searchTerm=${searchTerm}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Re-throw the error for handling in the component
    }
};
