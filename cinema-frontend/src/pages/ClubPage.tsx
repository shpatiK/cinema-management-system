"use client"

import { useState } from "react"
import { useAuthModal } from "../context/AuthModalContext"
import { FaGift, FaStar, FaTicketAlt, FaCreditCard, FaMobile, FaPercent } from "react-icons/fa"
import PaypalButton from "../components/PaypalButton"

// Import images
import popcornImg from "../assets/images/popcorn.jpg"
import drinkImg from "../assets/images/drink.png"
import nachosImg from "../assets/images/nachos.png"
import ticketImg from "../assets/images/ticket.png"
import kitkatImg from "../assets/images/kitkat.jpg"
import bonusCardImg from "../assets/images/bonuscard.jpg"

const ClubPage = () => {
  const { openModal } = useAuthModal()
  const [activeTab, setActiveTab] = useState("benefits")
  const [showPayPalModal, setShowPayPalModal] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState("")

  const rewards = [
    { points: 250, reward: "SMALL POPCORN", icon: popcornImg, category: "snacks" },
    { points: 300, reward: "MEDIUM SOFT DRINK (0.5L)", icon: drinkImg, category: "drinks" },
    { points: 350, reward: "SWEETS", icon: kitkatImg, category: "snacks" },
    { points: 400, reward: "MEDIUM POPCORN", icon: popcornImg, category: "snacks" },
    { points: 500, reward: "SMALL NACHOS", icon: nachosImg, category: "snacks" },
    { points: 1000, reward: "10x FREE TICKETS", icon: ticketImg, category: "tickets" },
  ]

  const memberBenefits = [
    {
      icon: <FaPercent className="text-yellow-600" />,
      title: "20% Discount on Tickets",
      description: "Save on every movie ticket purchase",
    },
    {
      icon: <FaGift className="text-yellow-600" />,
      title: "Exclusive Rewards",
      description: "Redeem points for free snacks and tickets",
    },
    {
      icon: <FaStar className="text-yellow-600" />,
      title: "VIP Treatment",
      description: "Priority booking and special screenings",
    },
    {
      icon: <FaTicketAlt className="text-yellow-600" />,
      title: "Birthday Perks",
      description: "Free ticket on your birthday month",
    },
    {
      icon: <FaCreditCard className="text-yellow-600" />,
      title: "Easy Payment",
      description: "Quick checkout with stored card balance",
    },
    {
      icon: <FaMobile className="text-yellow-600" />,
      title: "Mobile App Access",
      description: "Manage your account and book tickets on-the-go",
    },
  ]

  const topUpBenefits = [
    { amount: "€20", discount: "€0.50", bonus: "50 bonus points" },
    { amount: "€35", discount: "€0.50", bonus: "100 bonus points" },
    { amount: "€50", discount: "€0.50", bonus: "150 bonus points" },
  ]

  const handlePayPalSuccess = (details: any) => {
    alert(`Top-up successful! Thank you, ${details.payer?.name?.given_name || "customer"}`)
    setShowPayPalModal(false)
    setSelectedAmount("")
  }

  const handleTopUp = (amount: string) => {
    setSelectedAmount(amount)
    setShowPayPalModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section with Card Animation */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white py-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:flex items-center justify-between">
            <div className="md:w-2/3 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                INOX <span className="text-yellow-500">CLUB</span>
              </h1>
              <p className="text-xl md:text-2xl mb-6 text-white text-opacity-90">
                Join our exclusive membership program and unlock amazing rewards with every visit!
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                <div className="bg-black bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-bold">20%</span> off tickets
                </div>
                <div className="bg-black bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-bold">Free</span> birthday ticket
                </div>
                <div className="bg-black bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="font-bold">Exclusive</span> rewards
                </div>
              </div>
              <button
                onClick={openModal}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                JOIN NOW - IT'S FREE!
              </button>
            </div>

            {/* Bonus Card with Animation */}
            <div className="md:w-1/3 mt-8 md:mt-0 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500 rounded-xl blur-xl opacity-50 animate-pulse"></div>
                <img
                  src={bonusCardImg || "/placeholder.svg"}
                  alt="INOX Bonus Card"
                  className="relative h-48 w-auto object-contain transform hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: "benefits", label: "Member Benefits", icon: <FaStar /> },
              { id: "rewards", label: "Rewards Catalog", icon: <FaGift /> },
              { id: "topup", label: "Top-Up Benefits", icon: <FaCreditCard /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50"
                    : "text-gray-600 hover:text-yellow-600"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Member Benefits Tab */}
        {activeTab === "benefits" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Exclusive <span className="text-yellow-600">Member Benefits</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Enjoy premium perks and savings every time you visit INOX Cinema
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">{benefit.icon}</div>
                    <h3 className="font-bold text-lg">{benefit.title}</h3>
                  </div>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* How It Works Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">How INOX Club Works</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-yellow-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    1
                  </div>
                  <h4 className="font-bold mb-2">Sign Up</h4>
                  <p className="text-gray-600">Create your free INOX Club account and get your bonus card</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    2
                  </div>
                  <h4 className="font-bold mb-2">Earn Points</h4>
                  <p className="text-gray-600">Get points with every ticket and concession purchase</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    3
                  </div>
                  <h4 className="font-bold mb-2">Redeem Rewards</h4>
                  <p className="text-gray-600">Use your points for free tickets, snacks, and exclusive perks</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Catalog Tab */}
        {activeTab === "rewards" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Rewards <span className="text-yellow-600">Catalog</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Redeem your points for amazing rewards and treats</p>
            </div>

            <div className="grid gap-6">
              {rewards.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center">
                    {/* Points Badge */}
                    <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white font-bold rounded-xl w-20 h-20 flex-shrink-0 flex flex-col items-center justify-center mr-6 shadow-lg">
                      <span className="text-lg">{item.points}</span>
                      <span className="text-xs">PTS</span>
                    </div>

                    {/* Reward Image */}
                    {item.icon && (
                      <div className="w-20 h-20 flex-shrink-0 mr-6 bg-gray-50 rounded-lg p-2">
                        <img
                          src={item.icon || "/placeholder.svg"}
                          alt={item.reward.split("(")[0].trim()}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Reward Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{item.reward}</h3>
                      <div className="flex items-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.category === "tickets"
                              ? "bg-blue-100 text-blue-800"
                              : item.category === "drinks"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Redeem Button */}
                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300">
                      Redeem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top-Up Benefits Tab */}
        {activeTab === "topup" && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Top-Up <span className="text-yellow-600">Benefits</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Load money onto your bonus card and enjoy additional discounts and bonus points
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {topUpBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {benefit.amount}
                  </div>
                  <h3 className="font-bold text-lg mb-2">Top-Up {benefit.amount}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>✓ {benefit.discount} discount per ticket</p>
                    <p>✓ {benefit.bonus} bonus</p>
                    <p>✓ Online booking discount</p>
                  </div>
                  <button
                    onClick={() => handleTopUp(benefit.amount.replace("€", ""))}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors duration-300"
                  >
                    Top-Up Now
                  </button>
                </div>
              ))}
            </div>

            {/* Additional Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Additional Top-Up Advantages</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <FaMobile className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Mobile App Integration</h4>
                    <p className="text-gray-600">Top-up your card directly through our mobile app anytime, anywhere</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <FaTicketAlt className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Online Booking Discounts</h4>
                    <p className="text-gray-600">
                      Use your topped-up card for online bookings and get additional savings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-indigo-900 p-8 md:p-12 rounded-xl text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning Rewards?</h2>
          <p className="text-xl mb-8 text-white text-opacity-90">
            Join thousands of movie lovers who are already saving with INOX Club
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openModal}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105"
            >
              CREATE FREE ACCOUNT
            </button>
          </div>
        </div>
      </div>
      {/* PayPal Modal */}
      {showPayPalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Top-Up €{selectedAmount}</h3>
              <button onClick={() => setShowPayPalModal(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Complete your top-up payment using PayPal:</p>
            </div>
            <PaypalButton amount={selectedAmount} onSuccess={handlePayPalSuccess} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ClubPage
