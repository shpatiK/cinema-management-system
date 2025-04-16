import React from 'react';
import { useAuthModal } from '../context/AuthModalContext';
import popcornImg from '../assets/images/popcorn.jpg';
import drinkImg from '../assets/images/drink.png';
import nachosImg from '../assets/images/nachos.png';
import ticketImg from '../assets/images/ticket.png';
import kitkatImg from '../assets/images/kitkat.jpg';

const ClubPage = () => {
  const { openModal } = useAuthModal();
  const rewards = [
    { points: 250, reward: "SMALL POPCORN ", icon: popcornImg },
    { points: 300, reward: "MEDIUM SOFT DRINK (0.5L)", icon: drinkImg },
    { points: 350, reward: "SWEETS", icon: kitkatImg },
    { points: 400, reward: "MEDIUM POPCORN", icon: popcornImg },
    { points: 500, reward: "SMALL NACHOS", icon: nachosImg },
    { points: 1000, reward: "10x FREE TICKETS", icon: ticketImg },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-black text-white py-4 px-6">
        <h1 className="text-3xl font-bold">INOX CLUB</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-yellow-600 text-white py-12 px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">JOIN OUR CLUB!</h2>
        <p className="text-xl max-w-2xl mx-auto">
          Earn points with every purchase and enjoy exclusive member benefits
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Benefits Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6">MEMBER BENEFITS</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-yellow-100 rounded-full p-1 mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>20% discount on all tickets</span>
              </li>
              {/* Other list items... */}
            </ul>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-lg font-bold mb-4">HOW IT WORKS</h4>
              <p className="mb-4">
                With Bonus Card you can pay and get discounts for maximum 2 tickets per day. 
                You can earn up to 150 bonus points per day on tickets.
              </p>
              <p>
                At the concession stand, you can earn bonus points for maximum €50 spent per day.
              </p>
            </div>
          </div>

          {/* Rewards Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6">REWARDS CATALOG</h3>
            <div className="grid gap-4">
              {rewards.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md flex items-center">
                  <div className="bg-yellow-600 text-white font-bold rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4">
                    {item.points}
                  </div>
                  {item.icon && (
                    <div className="w-16 h-16 flex-shrink-0 mr-4">
                      <img 
                        src={item.icon} 
                        alt={item.reward.split('(')[0].trim()} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.reward}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-yellow-50 p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">TOP UP & GET MORE BENEFITS</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            When you top up your Cineplexx Bonus Card with €20, €35 or €50 at the counter, 
            you'll enjoy even more advantages:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p>€0.50 discount on tickets when you top up with €20, €35 or €50</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p>Buy tickets online with €0.50 discount</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p>Online top-up through our app</p>
            </div>
          </div>
          <button 
            onClick={openModal}
            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition"
          >
            CREATE AN ACCOUNT
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ClubPage;