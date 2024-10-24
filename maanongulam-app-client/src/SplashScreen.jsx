// src/pages/SplashScreen.js 
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 3000); // Navigate after 3 seconds

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-500">
      <h1 className="text-white text-4xl font-bold">Welcome to Ma! Anong Ulam App</h1>
    </div>
  );
};

export default SplashScreen;
