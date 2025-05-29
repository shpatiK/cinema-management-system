"use client"

import dokufestLogo from "../assets/images/dokufest.jpg"
import prifestLogo from "../assets/images/prifest.jpg"
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaExternalLinkAlt, FaFilm, FaAward } from "react-icons/fa"
import { useState } from "react"

const EventsPage = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email.trim()) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail("")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 py-16 px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3,
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-center mb-6">
            <FaFilm className="text-yellow-400 mr-3 text-3xl" />
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              CINEMA <span className="text-yellow-400">EVENTS</span>
            </h1>
            <FaAward className="text-yellow-400 ml-3 text-3xl" />
          </div>
          <p className="text-center text-gray-200 max-w-2xl mx-auto text-lg">
            Experience the magic of cinema through our special events and film festivals
          </p>
        </div>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Prifest Card */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-48 bg-gradient-to-r from-pink-500 to-red-500 p-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity duration-300"></div>
              <img
                src={prifestLogo || "/placeholder.svg"}
                alt="Prifest Logo"
                className="max-h-32 max-w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Prifest</h2>
                <span className="bg-pink-100 text-pink-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Film Festival
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="text-pink-600 mr-2" />
                  <span>September 10-15, 2025</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="text-pink-600 mr-2" />
                  <span>Pristina, Kosovo</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaUsers className="text-pink-600 mr-2" />
                  <span>Expected attendance: 5,000+</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Prifest celebrates the art of filmmaking with screenings, workshops, and special guests from around the
                world.
              </p>

              <div className="flex justify-between items-center">
                <a
                  href="https://prifest.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-600 to-red-600 text-white font-medium rounded-lg hover:from-pink-700 hover:to-red-700 transition-all duration-300"
                >
                  Learn More
                  <FaExternalLinkAlt className="ml-2" />
                </a>
                <span className="text-sm text-gray-500 italic">Tickets available soon</span>
              </div>
            </div>
          </div>

          {/* Dokufest Card */}
          <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-48 bg-gradient-to-r from-amber-500 to-yellow-500 p-6 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity duration-300"></div>
              <img
                src={dokufestLogo || "/placeholder.svg"}
                alt="Dokufest Logo"
                className="max-h-32 max-w-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Dokufest</h2>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Documentary Festival
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="text-amber-600 mr-2" />
                  <span>August 1-9, 2025</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="text-amber-600 mr-2" />
                  <span>Prizren, Kosovo</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="text-amber-600 mr-2" />
                  <span>Over 200 screenings</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Dokufest is Kosovo's largest film festival, showcasing outstanding documentaries and celebrating
                cultural diversity.
              </p>

              <div className="flex justify-between items-center">
                <a
                  href="https://dokufest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-medium rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-all duration-300"
                >
                  Learn More
                  <FaExternalLinkAlt className="ml-2" />
                </a>
                <span className="text-sm text-gray-500 italic">Early bird tickets available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Stay Updated on Cinema Events</h2>
          <p className="text-gray-300 mb-6">
            Subscribe to our newsletter to get the latest updates on film festivals and special screenings
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full sm:w-auto"
            />
            <button
              onClick={handleSubscribe}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg transition-colors duration-300"
            >
              {isSubscribed ? "Subscribed Successfully!" : "Subscribe"}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Film Strip */}
      <div className="bg-black py-4 flex justify-center overflow-hidden">
        <div className="flex space-x-2">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-8 h-16 bg-gray-800 rounded-sm relative">
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-black rounded-sm"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-black rounded-sm"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventsPage
