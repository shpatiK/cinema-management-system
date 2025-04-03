import React from 'react';

const RentPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">RENT A SCREENING ROOM</h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Rental Terms:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Capacity: 50-100 seats</li>
          <li>4K projection and professional sound system</li>
          <li>Prices starting from €100/day</li>
        </ul>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default RentPage;