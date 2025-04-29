import React from 'react';

const AdvertisingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Advertise in Our Cinemas</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        {/* Benefits Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">Why Advertise With Us?</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">✓</span>
              <span>Reach thousands of moviegoers daily</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">✓</span>
              <span>High-quality digital screens in premium locations</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">✓</span>
              <span>Target specific demographics and movie genres</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-400 mr-2">✓</span>
              <span>Flexible advertising packages</span>
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-800 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2> {/* Added text-white */}
          <form className="space-y-4">
            <div>
              <label className="block mb-2 text-white">Your Name</label> {/* Added text-white */}
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-gray-700 rounded text-white" /* Added text-white */
              />
            </div>
            <div>
              <label className="block mb-2 text-white">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-white">Company</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-white">Message</label>
              <textarea 
                className="w-full px-4 py-2 bg-gray-700 rounded h-32 text-white"
              ></textarea>
            </div>
           
            <button 
              type="submit" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center text-white">Advertising Packages</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              name: "Basic", 
              price: "$500", 
              features: ["15-second spot", "5 screens", "1 week rotation"] 
            },
            { name: "Premium", price: "$1200", features: ["30-second spot", "All screens", "2 week rotation", "Prime time slots"] },
            { name: "Platinum", price: "$2500", features: ["60-second spot", "All screens", "4 week rotation", "Prime time slots", "Social media promotion"] }
        ].map((pkg) => (
            <div key={pkg.name} className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-white"> {/* Added text-white */}
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <p className="text-2xl font-bold text-yellow-400 mb-4">{pkg.price}</p>
              <ul className="space-y-2">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvertisingPage;