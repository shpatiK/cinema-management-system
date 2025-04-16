import React from 'react';

const CinemasPage = () => {
  const cinemas = [
    {
      name: "CINEPLEXX PRIZREN",
      location: "Qendra Tregtare Galeria, Prizren",
      features: ["4K projection", "Dolby Atmos", "VIP lounges"]
    },
    {
      name: "CINEPLEXX ALBI MALL",
      location: "Zona e re Industria",
      features: ["7 screening rooms", "3D capability", "Wheelchair accessible"]
    },
    {
      name: "CINEPLEXX PRISHTINA MALL",
      location: "M2 (Prishtinë - Ferizaj)",
      features: ["Largest screen in Kosovo", "4DX experience", "Food service"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">OUR CINEMAS</h1>
          <p className="text-xl">Experience premium movie-going at our state-of-the-art locations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {cinemas.map((cinema, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
              <div className="bg-yellow-600 p-4">
                <h2 className="text-xl font-bold text-white">{cinema.name}</h2>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {cinema.location}
                </p>
                <ul className="space-y-2">
                  {cinema.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Facilities Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">OUR PREMIUM FACILITIES</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="font-semibold">4K Projection</h3>
            </div>
            <div>
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                </svg>
              </div>
              <h3 className="font-semibold">Dolby Atmos</h3>
            </div>
            <div>
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold">VIP Lounges</h3>
            </div>
            <div>
              <div className="bg-yellow-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Wheelchair Access</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinemasPage;