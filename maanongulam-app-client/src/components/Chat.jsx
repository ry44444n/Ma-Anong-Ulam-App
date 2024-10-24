import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socket;

const Chat = ({ username }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  const [newMessageAlert, setNewMessageAlert] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    socket = io(backendUrl);

    socket.on('chatMessage', (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
      setNewMessageAlert(true); // Alert for new message
    });

    // Retrieve previous messages
    socket.on('previousMessages', (messages) => {
      setChat(messages);
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight; // Scroll to the bottom
    });

    // Listen for typing status
    socket.on('typing', (user) => {
      setTyping(`${user} is typing...`);
      setTimeout(() => setTyping(false), 2000); // Clear typing message after 2 seconds
    });

    return () => {
      socket.off('chatMessage');
      socket.off('previousMessages');
      socket.off('typing');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (message.trim() && socket) {
      const msg = { user: username, text: message, timestamp: new Date() };
      socket.emit('chatMessage', msg);
      setMessage('');
      setNewMessageAlert(false); // Reset alert when sending message
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', username);
    }
  };

  return (
    <div className="chat-container">
      <div ref={chatBoxRef} className="chat-box h-64 overflow-y-auto border p-2 mb-2 bg-gray-100 rounded-md">
        {chat.length > 0 ? (
          chat.map((msg, index) => (
            <div key={index} className={`p-2 my-1 rounded-md ${msg.user === username ? 'bg-orange-400 text-white self-end' : 'bg-gray-200'}`}>
              <strong>{msg.user}:</strong> {msg.text}
              <div>  
                <span className="text-black-500 text-xs ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span> {/* Timestamp */}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No messages yet</div>
        )}
        {typing && <div className="text-gray-500 italic">{typing}</div>}
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping(); // Emit typing event
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevent default form submission
              handleSendMessage(e); // Call the send message function
            }
          }}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-md focus:outline-none"
        />
        <button type="submit" className="bg-orange-400 text-white p-2 rounded-md hover:bg-orange-600">
          Send
        </button>
      </form>
      {newMessageAlert && <div className="bg-yellow-200 p-2 rounded-md mb-2">New message received!</div>} {/* New message alert */}
    </div>
  );
};

export default Chat;
