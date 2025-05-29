"use client"

import { useState } from "react"
import { FaMapMarkerAlt, FaPhone, FaParking, FaWheelchair, FaBus, FaUtensils } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

// Import cinema images - you'll need to add these to your assets folder
import prizrenCinema from "../assets/images/prizren-cinema.png"
import albiMallCinema from "../assets/images/albi-mall-cinema.jpg"
import prishtinaMallCinema from "../assets/images/prishtina-mall-cinema.jpg"

const CinemasPage = () => {
  const [activeTab, setActiveTab] = useState("prizren")
  const navigate = useNavigate()

  const cinemas = [
    {
      id: "prizren",
      name: "INOX PRIZREN",
      location: "Qendra Tregtare Galeria, Prizren",
      image: prizrenCinema,
      description:
        "Our flagship location in the heart of Prizren offers a premium movie experience with state-of-the-art technology and luxurious comfort.",
      features: ["4K projection", "Dolby Atmos", "VIP lounges", "Concession stand", "Free parking"],
      screens: 5,
      capacity: 750,
      openingHours: "10:00 - 23:00",
      contact: "+383 44 123 456",
      mapsLink: "https://maps.google.com/?q=Galeria+Shopping+Mall+Prizren",
      transport: ["Parking available", "Bus stop nearby", "Taxi stand"],
    },
    {
      id: "albi",
      name: "INOX ALBI MALL",
      location: "Zona e re Industria, Prishtina",
      image: albiMallCinema,
      description:
        "Located in Albi Mall, this modern multiplex offers the perfect combination of shopping and entertainment for the whole family.",
      features: ["7 screening rooms", "3D capability", "Wheelchair accessible", "Family rooms", "IMAX screen"],
      screens: 7,
      capacity: 1200,
      openingHours: "09:00 - 00:00",
      contact: "+383 44 789 012",
      mapsLink: "https://maps.google.com/?q=Albi+Mall+Prishtina",
      transport: ["Free parking", "Bus routes: 1, 3, 4", "Mall shuttle service"],
    },
    {
      id: "prishtina",
      name: "INOX PRISHTINA MALL",
      location: "M2 (Prishtinë - Ferizaj)",
      image: prishtinaMallCinema,
      description:
        "Our newest and largest cinema complex features cutting-edge technology and premium amenities for the ultimate movie experience.",
      features: ["Largest screen in Kosovo", "4DX experience", "Food service", "Premium lounge", "Gaming zone"],
      screens: 10,
      capacity: 1800,
      openingHours: "10:00 - 01:00",
      contact: "+383 44 345 678",
      mapsLink: "https://maps.google.com/?q=Prishtina+Mall",
      transport: ["Extensive parking", "Mall shuttle", "Taxi service"],
    },
  ]

  const openGoogleMaps = (url: string) => {
    window.open(url, "_blank")
  }

  const getActiveCinema = () => {
    return cinemas.find((cinema) => cinema.id === activeTab) || cinemas[0]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cinema Background */}
      <div className="relative bg-black text-white py-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
          }}
        ></div>

        {/* Content */}
        <div className="max-w-7xl mx-auto text-center relative z-20 px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">
            OUR <span className="text-yellow-500">CINEMAS</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Experience premium movie-going at our state-of-the-art locations across Kosovo. Immerse yourself in
            cutting-edge technology and unparalleled comfort.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500">3</div>
              <div className="text-gray-300">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500">22</div>
              <div className="text-gray-300">Screens</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500">3,750+</div>
              <div className="text-gray-300">Seats</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500">4K</div>
              <div className="text-gray-300">Projection</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cinema Tabs Navigation */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {cinemas.map((cinema) => (
              <button
                key={cinema.id}
                onClick={() => setActiveTab(cinema.id)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === cinema.id
                    ? "text-yellow-600 border-b-2 border-yellow-600"
                    : "text-gray-600 hover:text-yellow-600"
                }`}
              >
                {cinema.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Selected Cinema Details */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Selected Cinema Details */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Cinema Image */}
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img
                src={getActiveCinema().image || "/placeholder.svg?height=500&width=800"}
                alt={`${getActiveCinema().name} cinema`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-0 left-0 bg-yellow-600 text-white px-4 py-2 rounded-br-lg font-bold">
                {getActiveCinema().screens} Screens
              </div>
            </div>

            {/* Cinema Info */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold mb-2">{getActiveCinema().name}</h2>
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="mr-2 text-yellow-600" />
                {getActiveCinema().location}
              </div>

              <p className="text-gray-600 mb-6">{getActiveCinema().description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500">OPENING HOURS</div>
                  <div className="font-medium">{getActiveCinema().openingHours}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">CONTACT</div>
                  <div className="font-medium flex items-center">
                    <FaPhone className="mr-2 text-yellow-600" size={14} />
                    {getActiveCinema().contact}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">CAPACITY</div>
                  <div className="font-medium">{getActiveCinema().capacity} seats</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">SCREENS</div>
                  <div className="font-medium">{getActiveCinema().screens} screens</div>
                </div>
              </div>

              <button
                onClick={() => openGoogleMaps(getActiveCinema().mapsLink)}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
              >
                <FaMapMarkerAlt className="mr-2" />
                View on Google Maps
              </button>
            </div>
          </div>

          {/* Features and Transport */}
          <div className="border-t border-gray-200 px-8 py-6">
            <div className="md:flex">
              {/* Features */}
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-4">
                <h3 className="font-bold text-lg mb-3">Features</h3>
                <div className="grid grid-cols-2 gap-y-2">
                  {getActiveCinema().features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                        <svg
                          className="w-3 h-3 text-yellow-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport */}
              <div className="md:w-1/2 md:pl-4 md:border-l border-gray-200">
                <h3 className="font-bold text-lg mb-3">Transport & Access</h3>
                <div className="space-y-2">
                  {getActiveCinema().transport.map((item, i) => (
                    <div key={i} className="flex items-center">
                      {i === 0 && <FaParking className="text-yellow-600 mr-2" />}
                      {i === 1 && <FaBus className="text-yellow-600 mr-2" />}
                      {i === 2 && <FaWheelchair className="text-yellow-600 mr-2" />}
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          {/*
          <div className="bg-gray-50 px-8 py-6 flex flex-wrap items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Ready to experience the magic of cinema?</h3>
              <p className="text-gray-600">Check out what's playing today at {getActiveCinema().name}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="bg-black hover:bg-gray-800 text-white py-3 px-6 rounded-lg transition-colors duration-300 flex items-center">
                <FaTicketAlt className="mr-2" />
                View Showtimes
              </button>
            </div>
          </div>
          */}
        </div>

        {/* Facilities Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-10 text-center">
            OUR <span className="text-yellow-600">PREMIUM</span> FACILITIES
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-center mb-2">4K Projection</h3>
              <p className="text-gray-600 text-center text-sm">
                Crystal clear picture quality with 4K resolution for the ultimate visual experience.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-center mb-2">Dolby Atmos</h3>
              <p className="text-gray-600 text-center text-sm">
                Immersive sound technology that places audio anywhere in the theater for a 3D sound experience.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <FaUtensils className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-bold text-lg text-center mb-2">Premium Food</h3>
              <p className="text-gray-600 text-center text-sm">
                Enjoy gourmet snacks, meals and beverages delivered right to your seat.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-transform hover:scale-105">
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg text-center mb-2">Accessibility</h3>
              <p className="text-gray-600 text-center text-sm">
                Wheelchair access, hearing assistance and special needs accommodations at all locations.
              </p>
            </div>
          </div>
        </div>

        {/* Membership Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex items-center">
            <div className="md:w-2/3 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-4">Become an INOX VIP Member</h2>
              <p className="text-white text-opacity-90 mb-6">
                Get exclusive benefits including discounted tickets, free upgrades, special screenings and more.
              </p>
              <button
                onClick={() => navigate("/club")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-8 rounded-lg transition-colors duration-300 font-bold"
              >
                Learn More
              </button>
            </div>
            <div className="md:w-1/3 bg-black bg-opacity-20 p-8 md:p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-white mb-2">20%</div>
                <div className="text-white text-opacity-90">Discount on tickets</div>
                <div className="h-px bg-white bg-opacity-30 my-4"></div>
                <div className="text-5xl font-bold text-white mb-2">2+1</div>
                <div className="text-white text-opacity-90">Free popcorn refill</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CinemasPage
