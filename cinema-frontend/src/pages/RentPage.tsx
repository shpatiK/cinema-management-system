// src/pages/RentPage.js
import React, { useState } from 'react';
import kinemaImage from '../assets/images/kinema.jpg';
import ContactForm from '../components/ContactForm';

const RentPage = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal Overlay */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ContactForm onClose={() => setShowContactModal(false)} />
        </div>
      )}

      {/* Hero Section with Cinema Image */}
      <div className="relative h-96 w-full overflow-hidden">
        <img 
          src={kinemaImage} 
          alt="Cinema Screening Room" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            RENT A SCREENING ROOM
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Rental Terms</h2>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="bg-yellow-500 rounded-full p-1 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Capacity: 50-100 seats</span>
            </li>
            <li className="flex items-start">
              <div className="bg-yellow-500 rounded-full p-1 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">4K projection and professional sound system</span>
            </li>
            <li className="flex items-start">
              <div className="bg-yellow-500 rounded-full p-1 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Prices starting from €100/day</span>
            </li>
          </ul>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-6">Ready to book your private screening?</h3>
            <button
              onClick={() => setShowContactModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentPage;