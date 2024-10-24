// api/userApi.js

export const fetchUserData = async (userId) => {
  try {
    console.log('Fetching user ID:', userId); // Debug line to check userId

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/user/${userId}`);
    if (!response.ok) {
      throw new Error('Error fetching user data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    // Log the userData to check what's being sent
    console.log('Updating user with ID:', userId, 'Data:', userData);
    
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get response text for more info
      throw new Error(`Error updating user: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error deleting user');
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

export const deactivateUser = async (userId) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/deactivate/${userId}`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Error deactivating user');
    }
  } catch (error) {
    console.error('Failed to deactivate user:', error);
    throw error;
  }
};
