// src/components/Modal.jsx
import React, { useEffect, useRef } from 'react';

const Modal = ({ children, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    // Close modal when pressing 'Escape'
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Close modal when clicking outside of it
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50" onClick={handleClickOutside}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl h-auto" ref={modalRef} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">✖</button>
        <div className="modal-content" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;