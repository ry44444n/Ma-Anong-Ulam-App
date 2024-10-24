import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Chat from './Chat';
import { AiOutlineMessage } from 'react-icons/ai';

const MainLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const username = localStorage.getItem('username') || 'Guest';

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Outlet />

      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="bg-orange-400 text-white p-3 rounded-full fixed bottom-5 right-5 hover:bg-orange-600 shadow-lg"
        >
          <AiOutlineMessage size={24} />
        </button>
      )}

      {isChatOpen && (
        <div className="fixed bottom-0 right-5 w-80 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between items-center bg-orange-400 text-white p-2 rounded-t-lg">
            <span>Chat with Ka-MAU</span>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleMinimize} 
                className="text-white hover:text-gray-200"
                title={isMinimized ? 'Maximize chat' : 'Minimize chat'}
              >
                {isMinimized ? '▢' : '—'}
              </button>
              <button 
                onClick={toggleChat} 
                className="text-white hover:text-gray-200"
                title="Close chat"
              >
                ✕
              </button>
            </div>
          </div>
          <div className={`p-4 ${isMinimized ? 'hidden' : 'block'}`}>
            <Chat username={username} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
