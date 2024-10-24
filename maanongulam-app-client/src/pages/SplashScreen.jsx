import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eaticon from '../assets/eaticon.png';
import backgroundImageAuth from '../assets/table4.png';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [isBlurred, setIsBlurred] = useState(false); // State to trigger the blur effect

  useEffect(() => {
    // Trigger the blur-out animation after 2.5 seconds
    const timer1 = setTimeout(() => {
      setIsBlurred(true);
    }, 2500);

    // Navigate after 3 seconds (after the animation finishes)
    const timer2 = setTimeout(() => {
      navigate('/auth');
    }, 3500);

    // Cleanup timers on unmount
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div 
      className="flex flex-col min-h-screen items"
      style={{
      backgroundImage: `url(${backgroundImageAuth})`,
      backgroundSize: 'cover', 
      backgroundPosition: 'center', 
      backgroundRepeat: 'no-repeat', 
      }}
    >
      <div
        className={`flex flex-col items-center justify-center h-screen transition-all duration-500 
        ${isBlurred ? 'opacity-0 blur-sm' : ''}`}
        style={{
          backgroundImage: `url(${eaticon})`,
          backgroundSize: '250px', 
          backgroundPosition: 'center 250px', 
          backgroundRepeat: 'no-repeat', 
        }}
      >
        <h1 className= "text-5xl font-bold text-orange-600 mb-4 font-marmelad">Ma, Anong Ulam?</h1>
      </div>  
    </div>

  );
};

export default SplashScreen;
