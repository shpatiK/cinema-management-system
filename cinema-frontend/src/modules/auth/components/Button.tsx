import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void; 
  to?: string; 
  type?: 'button' | 'submit' | 'reset'; 
  className?: string; 
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  to, 
  type = 'button', 
  className = '' 
}) => {
  
  if (to) {
    return (
      <Link 
        to={to} 
        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;