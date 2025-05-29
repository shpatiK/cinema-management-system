"use client"

import { useState, useRef } from "react"
import { FaUsers, FaFilm, FaVolumeUp, FaCalendarAlt, FaClock, FaPhone, FaEnvelope } from "react-icons/fa"
import kinemaImage from "../assets/images/kinema.jpg"
import ContactForm from "../components/ContactForm"

const RentPage = () => {
  const [showContactModal, setShowContactModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState("basic")

  const packagesRef = useRef<HTMLDivElement>(null)

  const rentalPackages = [
    {
      id: "basic",
      name: "Basic Screening",
      price: "€100",
      duration: "3 hours",
      capacity: "50 seats",
      features: [
        "4K Digital Projection",
        "Surround Sound System",
        "Basic Lighting Control",
        "Standard Seating",
        "Technical Support",
      ],
      popular: false,
    },
    {
      id: "premium",
      name: "Premium Experience",
      price: "€200",
      duration: "5 hours",
      capacity: "100 seats",
      features: [
        "4K Digital Projection",
        "Dolby Atmos Sound",
        "Advanced Lighting Control",
        "Premium Seating",
        "Dedicated Technical Support",
        "Concession Stand Access",
        "Red Carpet Setup",
      ],
      popular: true,
    },
    {
      id: "luxury",
      name: "Luxury Private Cinema",
      price: "€350",
      duration: "Full Day",
      capacity: "100 seats",
      features: [
        "4K Digital Projection",
        "Dolby Atmos Sound",
        "Full Lighting Control",
        "VIP Seating",
        "Personal Event Coordinator",
        "Full Concession Service",
        "Red Carpet & Photography",
        "Welcome Reception Area",
        "Catering Options Available",
      ],
      popular: false,
    },
  ]

  const eventTypes = [
    {
      icon: <FaFilm className="text-yellow-600" />,
      title: "Film Premieres",
      description: "Launch your movie with a professional premiere experience",
    },
    {
      icon: <FaUsers className="text-yellow-600" />,
      title: "Corporate Events",
      description: "Host presentations, meetings, or team building events",
    },
    {
      icon: <FaCalendarAlt className="text-yellow-600" />,
      title: "Private Parties",
      description: "Celebrate birthdays, anniversaries, or special occasions",
    },
    {
      icon: <FaVolumeUp className="text-yellow-600" />,
      title: "Educational Screenings",
      description: "Perfect for schools, universities, and training sessions",
    },
  ]

  const additionalServices = [
    { service: "Professional Photography", price: "€50" },
    { service: "Catering Service", price: "€15/person" },
    { service: "Extended Hours (per hour)", price: "€25" },
    { service: "Additional Technical Support", price: "€40/hour" },
    { service: "Custom Branding Setup", price: "€75" },
    { service: "Live Streaming Setup", price: "€150" },
  ]

  const scrollToPackages = () => {
    packagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Modal Overlay */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ContactForm onClose={() => setShowContactModal(false)} />
        </div>
      )}

      {/* Hero Section with Enhanced Design */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <img
          src={kinemaImage || "/placeholder.svg"}
          alt="Cinema Screening Room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                RENT A <span className="text-yellow-500">SCREENING</span> ROOM
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
                Create unforgettable experiences with our state-of-the-art cinema facilities. Perfect for premieres,
                corporate events, and private celebrations.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Book Now
                </button>
                <button
                  onClick={scrollToPackages}
                  className="border-2 border-white text-white hover:bg-white hover:text-black font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300"
                >
                  View Packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">3</div>
              <div className="text-gray-600">Screening Rooms</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">100+</div>
              <div className="text-gray-600">Max Capacity</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">4K</div>
              <div className="text-gray-600">Projection Quality</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Types Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Perfect for <span className="text-yellow-500">Any Event</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our versatile screening rooms can be customized for various types of events and occasions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventTypes.map((event, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <div className="text-2xl">{event.icon}</div>
                </div>
                <h3 className="font-bold text-lg text-center mb-3">{event.title}</h3>
                <p className="text-gray-600 text-center">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rental Packages */}
      <div ref={packagesRef} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Choose Your <span className="text-yellow-500">Package</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select the perfect rental package that fits your event needs and budget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {rentalPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2 ${
                  pkg.popular ? "ring-4 ring-yellow-500 scale-105" : ""
                }`}
              >
                {pkg.popular && <div className="bg-yellow-500 text-black text-center py-2 font-bold">MOST POPULAR</div>}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-yellow-500 mb-4">
                    {pkg.price}
                    <span className="text-lg text-gray-600 font-normal">/{pkg.duration}</span>
                  </div>
                  <div className="flex items-center mb-6">
                    <FaUsers className="text-yellow-500 mr-2" />
                    <span className="text-gray-600">Up to {pkg.capacity}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-yellow-100 rounded-full p-1 mr-3 mt-0.5">
                          <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setSelectedPackage(pkg.id)
                      setShowContactModal(true)
                    }}
                    className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
                      pkg.popular
                        ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                        : "bg-gray-800 hover:bg-gray-900 text-white"
                    }`}
                  >
                    Select Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Additional <span className="text-yellow-600">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your event with our premium add-on services
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {additionalServices.map((service, index) => (
                <div
                  key={index}
                  className={`p-6 flex justify-between items-center ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } ${index < additionalServices.length - 2 ? "border-b border-gray-200" : ""}`}
                >
                  <span className="font-medium text-gray-800">{service.service}</span>
                  <span className="font-bold text-yellow-600 text-lg">{service.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ready to Book Your Event?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Contact our event specialists to discuss your requirements and get a custom quote
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Why Choose INOX for Your Event?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-yellow-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>State-of-the-art projection and sound technology</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-yellow-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Professional event coordination and support</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-yellow-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Flexible scheduling and customization options</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-yellow-500 rounded-full p-1 mr-3 mt-1">
                    <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>Competitive pricing with transparent costs</span>
                </li>
              </ul>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FaPhone className="text-yellow-500 mr-4" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-gray-300">+383 44 123 456</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-yellow-500 mr-4" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-gray-300">events@inox.com</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-yellow-500 mr-4" />
                  <div>
                    <div className="font-medium">Business Hours</div>
                    <div className="text-gray-300">Mon-Sun: 9:00 AM - 10:00 PM</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(true)}
                className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition-all duration-300"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentPage
