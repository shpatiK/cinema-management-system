import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';
import SearchBar from './SearchBar';
import inoxLogo from '../assets/images/logo.png'; 

const Header = () => {
  const { openModal } = useAuthModal();
  
  const navItems = [
    { text: "MOVIES", path: "/movies" },
    { text: "EVENTS", path: "/events" },
    { text: "CINEMAS", path: "/cinema" },
    { text: "CLUB", path: "/club" },
    { text: "RENT A HALL", path: "/rent" },
  ];

  return (
    <header className="bg-blue-900 text-white py-4 text-center"> 
    <Link to="/" className="inline-block">
      <img 
        src={inoxLogo} 
        alt="INOX Logo" 
        className="h-20 mx-auto hover:opacity-90 transition-opacity" 
        
      />
    </Link>
    
    <div className="flex justify-center items-center flex-wrap gap-4 mt-2"> 
      {navItems.map((item, index) => (
        <React.Fragment key={item.path}>
          <Link 
            to={item.path} 
            className="text-xl font-medium uppercase hover:text-yellow-300 transition-colors" 
          >
            {item.text}
          </Link>
        
          {index < navItems.length - 1 && (
            <span className="text-xl">|</span> 
          )}
        </React.Fragment>
      ))}
    </div>
    
    <div className="flex justify-center items-center gap-6 mt-4"> 
      <div className="relative w-1/3">
        <SearchBar /> 
      </div>
      <button 
        onClick={openModal}
        className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors text-sm" // Slightly smaller text
      >
        Login
      </button>
    </div>
  </header>
  );
};

export default Header;