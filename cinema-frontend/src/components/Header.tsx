import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const navItems = [
    { text: "MOVIES", path: "/movies" },
    { text: "BOOK", path: "/booking" },
    { text: "EVENTS", path: "/events" },
    { text: "CINEMAS", path: "/cinema" },
    { text: "CLUB", path: "/club" },
    { text: "RENT A HALL", path: "/rent" }
  ];

  return (
    // Header.tsx
<header className="bg-gray-900/90 backdrop-blur-md sticky top-0 z-50">
  <div className="container mx-auto px-6 py-4">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-yellow-400">INOX</h1>
      <nav className="hidden md:flex space-x-8">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className="text-white hover:text-yellow-400 transition-colors font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-400 after:transition-all hover:after:w-full"
          >
            {item.text}
          </Link>
        ))}
      </nav>
      <button className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-full text-black font-bold transition-colors">
        Login
      </button>
    </div>
  </div>
</header>
  );
};

export default Header;