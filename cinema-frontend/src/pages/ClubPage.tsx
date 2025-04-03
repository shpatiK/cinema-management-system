import React from 'react';

const ClubPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">FILM CLUB</h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Join Our Club!</h2>
        <p className="mb-4">Member benefits include:</p>
        <ul className="list-disc pl-5">
          <li>20% discount on all tickets</li>
          <li>Exclusive preview screenings</li>
        </ul>
      </div>
    </div>
  );
};

export default ClubPage;