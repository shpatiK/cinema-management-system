import React, { useState } from 'react';

const BookingPage = () => {
  
  const [seats, setSeats] = useState<string[]>([]);
  const [showtime, setShowtime] = useState('18:00');

  
  const seatMap = Array(50).fill(null).map((_, i) => `A${i+1}`);

  

 
  const handleBooking = async () => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seats, showtime })
      });
      
      if (!response.ok) throw new Error('Booking failed');
      alert('Booking confirmed!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Booking failed: ' + errorMessage);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Book Tickets</h1>
      
     
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Time</h2>
        <div className="flex gap-2">
          {['14:00', '16:00', '18:00', '20:00'].map(time => (
            <button 
              key={time}
              onClick={() => setShowtime(time)}
              className={`px-4 py-2 rounded ${
                showtime === time ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Choose Seats</h2>
        <div className="grid grid-cols-8 gap-2">
          {seatMap.map(seat => (
            <button
              key={seat}
              onClick={() => setSeats(prev => 
                prev.includes(seat) 
                  ? prev.filter(s => s !== seat) 
                  : [...prev, seat]
              )}
              className={`w-10 h-10 rounded ${
                seats.includes(seat) ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              {seat}
            </button>
          ))}
        </div>
      </div>

     
      <button 
        onClick={handleBooking}
        disabled={seats.length === 0}
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg
                 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Confirm Booking (${seats.length * 10})
      </button>
    </div>
  );
};

export default BookingPage;