import React from 'react';
import dokufestLogo from '../../../assets/images/dokufest.jpg';
import prifestLogo from '../../../assets/images/prifest.jpg';

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">CINEMA EVENTS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prifest Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="mb-4 w-32 h-32 flex items-center justify-center">
            <img 
              src={prifestLogo} 
              alt="Prifest Logo" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <h2 className="text-xl font-bold">Prifest</h2>
          <p className="text-gray-600 mt-2">September 10-15, 2025</p>
          <a 
            href="https://prifest.net" 
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Learn More →
          </a>
        </div>

        {/* Dokufest Card */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <div className="mb-4 w-32 h-32 flex items-center justify-center">
            <img 
              src={dokufestLogo} 
              alt="Dokufest Logo" 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <h2 className="text-xl font-bold">Dokufest</h2>
          <p className="text-gray-600 mt-2">August 1-9, 2025</p>
          <a 
            href="https://dokufest.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Learn More →
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;