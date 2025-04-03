import React from 'react';

const EventsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">CINEMA EVENTS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Prifest</h2>
          <p className="text-gray-600 mt-2">November 15-20, 2025</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Dokufest</h2>
          <p className="text-gray-600 mt-2">August 15-20, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;