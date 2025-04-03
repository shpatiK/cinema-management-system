import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import BookingPage from './pages/BookingPage';
import EventsPage from './pages/EventsPage';
import ClubPage from './pages/ClubPage';
import RentPage from './pages/RentPage';
import CinemasPage from './pages/CinemasPage';
import SearchBar from './components/SearchBar';
import AuthModal from './components/AuthModal';
import SearchPage from './pages/SearchPage';

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  
  const navItems = [
    { text: "MOVIES", path: "/movies" },
    { text: "EVENTS", path: "/events" },
    { text: "CINEMAS", path: "/cinema" },
    { text: "CLUB", path: "/club" },
    { text: "RENT A HALL", path: "/rent" },
    { text: "BOOK", path: "/booking" }
  ];

  return (
    <Router>
      
      <header className="bg-blue-900 text-white p-6 text-center">
       
        <h1 className="text-4xl font-bold mb-6">INOX</h1>
        
        
        <div className="flex justify-center items-center flex-wrap gap-6 mb-8">
          {navItems.map((item, index) => (
            <React.Fragment key={item.path}>
              <Link 
                to={item.path} 
                className="text-2xl font-medium uppercase hover:text-yellow-300 transition-colors"
              >
                {item.text}
              </Link>
             
              {index < navItems.length - 1 && (
                <span className="text-2xl">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
        
        
        <div className="flex justify-center items-center gap-8">
         
          <div className="relative w-1/3">
            <SearchBar /> 
          </div>
          
        
          <button 
            onClick={() => setShowAuthModal(true)}
            className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors"
          >
            Login
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/cinema" element={<CinemasPage />} />
          <Route path="/club" element={<ClubPage />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </Router>
  );
}

export default App;