import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
        <p className="text-lg text-gray-700 mb-4">
          Welcome to <span className="font-semibold text-indigo-600">INOX</span> – your ultimate destination for an exceptional cinematic experience!
        </p>
        <p className="text-gray-700 mb-4">
          At INOX, we don't just show movies — we create experiences. With state-of-the-art projection technology and an advanced sound system, every screening feels immersive and unforgettable.
        </p>
        <p className="text-gray-700 mb-4">
          Our cinema offers a comfortable atmosphere, cozy seating, and a wide selection of films — from the latest Hollywood blockbusters to European and Albanian productions.
        </p>
        <p className="text-gray-700 mb-4">
          We’re committed to providing top-quality service, with a friendly staff and seamless online booking through our digital platform.
        </p>
        <p className="text-gray-700">
          Thank you for being part of the INOX experience. See you at the movies!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
