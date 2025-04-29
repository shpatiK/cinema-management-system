import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthModalProvider } from './context/AuthModalContext';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import EventsPage from './pages/EventsPage';
import ClubPage from './pages/ClubPage';
import RentPage from './pages/RentPage';
import CinemasPage from './pages/CinemasPage';
import AuthModal from './components/AuthModal';
import SearchPage from './pages/SearchPage';
import PrivacyPolicyPage from './/pages/PrivacyPolicyPage';
import ContactUsPage from './pages/ContactUsPage';
import Footer from './components/Footer'; 
import MovieDetailsPage from './components/MovieDetailsPage';
import Header from './components/Header';
import AdvertisingPage from './pages/AdvertisingPage';
import BookingPage from './pages/BookingPage';
import { ModalProvider } from './context/ModalContext';

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
      <ModalProvider>
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
      </ModalProvider>
    </AuthModalProvider>
  );
}

export default App;