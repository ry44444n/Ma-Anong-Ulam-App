// src/api/authApi.js
export const authenticateUser = async (values, isLogin) => {
  const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const url = isLogin 
    ? `${baseURL}/api/users/login` 
    : `${baseURL}/api/users/register`;
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
  
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Something went wrong');
    }
  
    return await response.json();
  };
  