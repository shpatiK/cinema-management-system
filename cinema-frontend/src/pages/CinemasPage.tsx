import React from 'react';

const CinemasPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">ABOUT OUR CINEMA</h1>
      
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
       
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Our Facilities</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>5 modern screening rooms</li>
            <li>4K digital projection</li>
            <li>Dolby Atmos sound systems</li>
            <li>Wheelchair accessible</li>
          </ul>
        </div>

       
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Location</h2>
          <p className="mt-4">Prishtina Mall,M2 (Prishtine - Ferizaj)</p>
          <p className="mt-4">Galeria Shopping Mall,rr.Tirana, Prizren </p>
        </div>
      </div>
    </div>
  );
};

export default CinemasPage;