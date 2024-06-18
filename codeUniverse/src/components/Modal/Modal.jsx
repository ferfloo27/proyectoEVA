// src/components/Modal.js
import React from 'react';
import './Modal.css';

export const Modal = ({ isVisible, onClose, message }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        {/* <button onClick={onClose}>Cerrar</button> */}
      </div>
    </div>
  );
};
