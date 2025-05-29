"use client"
import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { AuthModalProvider } from "./context/AuthModalContext"
import { AuthProvider } from "./context/AuthContext"
import HomePage from "./pages/HomePage"
import MoviesPage from "./pages/MoviesPage"
import EventsPage from "./pages/EventsPage"
import ClubPage from "./pages/ClubPage"
import RentPage from "./pages/RentPage"
import CinemasPage from "./pages/CinemasPage"
import AuthModal from "./components/AuthModal"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import ContactUsPage from "./pages/ContactUsPage"
import Footer from "./components/Footer"
import MovieDetailsPage from "./components/MovieDetailsPage"
import Header from "./components/Header"
import AdvertisingPage from "./pages/AdvertisingPage"
import BookingPage from "./pages/BookingPage"
import BookingConfirmationPage from "./pages/BookingConfirmationPage"
import ActivationPage from "./pages/ActivationPage"
import { ModalProvider } from "./context/ModalContext"
import DashboardPage from "./pages/DashboardPage"
import AdminDashboard from "./pages/AdminDashboard"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import AboutUsPage from "./pages/AboutUsPage"

const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, [pathname])

  return null
}

function App() {
  return (
    <PayPalScriptProvider
      options={{ clientId: "AYDahqNqNSJKUt2bmX_4XP2ZTtixRkVL-Q4T6m8QMbY5I3lZKl-QDB2Ez46T4iu_dfgPG1WojyiC-tC6" }}
    >
      <AuthProvider>
        <AuthModalProvider>
          <ModalProvider>
            <Router>
              <ScrollToTop />
              <div className="flex flex-col min-h-screen">
                {/* Fixed header that floats over content */}
                <Header />

                {/* Main content with no top padding for homepage */}
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/movies"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <MoviesPage />
                        </div>
                      }
                    />
                    <Route
                      path="/events"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <EventsPage />
                        </div>
                      }
                    />
                    <Route
                      path="/cinema"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <CinemasPage />
                        </div>
                      }
                    />
                    <Route
                      path="/club"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <ClubPage />
                        </div>
                      }
                    />
                    <Route
                      path="/rent"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <RentPage />
                        </div>
                      }
                    />
                    <Route path="/AboutUsPage" element={<AboutUsPage />} />

                    <Route
                      path="/privacy-policy"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <PrivacyPolicyPage />
                        </div>
                      }
                    />
                    <Route
                      path="/contact-us"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <ContactUsPage />
                        </div>
                      }
                    />
                    <Route
                      path="/movies/:id"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <MovieDetailsPage />
                        </div>
                      }
                    />
                    <Route
                      path="/advertising"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <AdvertisingPage />
                        </div>
                      }
                    />
                    {/* Updated booking route to use movieId parameter */}
                    <Route
                      path="/booking/:movieId"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <BookingPage />
                        </div>
                      }
                    />
                    {/* New booking confirmation route */}
                    <Route
                      path="/booking-confirmation/:reference"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <BookingConfirmationPage />
                        </div>
                      }
                    />
                    <Route
                      path="/activate"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <ActivationPage />
                        </div>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <DashboardPage />
                        </div>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <div className="pt-32 container mx-auto p-4">
                          <AdminDashboard />
                        </div>
                      }
                    />
                  </Routes>
                </main>

                <Footer />
                <AuthModal />
              </div>
            </Router>
          </ModalProvider>
        </AuthModalProvider>
      </AuthProvider>
    </PayPalScriptProvider>
  )
}

export default App
