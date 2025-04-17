import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthModalProvider } from './context/AuthModalContext';
import HomePage from './modules/auth/pages/HomePage';
import MoviesPage from './modules/auth/pages/MoviesPage';
import EventsPage from './modules/auth/pages/EventsPage';
import ClubPage from './modules/auth/pages/ClubPage';
import RentPage from './modules/auth/pages/RentPage';
import CinemasPage from './modules/auth/pages/CinemasPage';
import AuthModal from './modules/auth/components/AuthModal';
import SearchPage from './modules/auth/pages/SearchPage';
import PrivacyPolicyPage from './modules/auth/pages/PrivacyPolicyPage';
import ContactUsPage from './modules/auth/pages/ContactUsPage';
import Footer from './modules/auth/components/Footer'; 
import MovieDetailsPage from './modules/auth/components/MovieDetailsPage';
import Header from './modules/auth/components/Header';
import AdvertisingPage from './modules/auth/pages/AdvertisingPage';
import BookingPage from './modules/auth/pages/BookingPage';






// Add this ScrollToTop component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scrolling animation
    });
  }, [pathname]);

  return null;
};

function App() {
  return (
    <AuthModalProvider>
      <Router>
        {/* Add ScrollToTop right inside Router */}
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          
          <main className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/cinema" element={<CinemasPage />} />
              <Route path="/club" element={<ClubPage />} />
              <Route path="/rent" element={<RentPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route path="/movies/:id" element={<MovieDetailsPage />} />
              <Route path="/advertising" element={<AdvertisingPage />} />
              <Route path="/booking/:id" element={<BookingPage />} />

            </Routes>
          </main>

          <Footer />
          <AuthModal />
        </div>
      </Router>
    </AuthModalProvider>
  );
}

export default App;