import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">

          {/* Column 1 - Main Info */}
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4">INOX</h3>
            <div className="flex items-center mb-4">
              <FaLocationDot className="text-yellow-500 mr-2" />
              <span>Prishtina & Prizren</span>
            </div>
          </div>

          {/* Column 2 - Movies */}
          <div>
            <h4 className="font-bold mb-4">MOVIES</h4>
            <ul className="space-y-2">
              <li><Link to="/events" className="hover:text-yellow-400 transition-colors">Events</Link></li>
              <li><Link to="/movies" className="hover:text-yellow-400 transition-colors">Top movies</Link></li>
            </ul>
          </div>

          {/* Column 3 - Information */}
          <div>
            <h4 className="font-bold mb-4">INFORMATION</h4>
            <ul className="space-y-2">
              <li><Link to="/club" className="hover:text-yellow-400 transition-colors">Cinema Club</Link></li>
              <li><Link to="/AboutUsPage" className="hover:text-yellow-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Column 4 - Company */}
          <div>
            <h4 className="font-bold mb-4">B2B</h4>
            <ul className="space-y-2">
              <li><Link to="/rent" className="hover:text-yellow-400 transition-colors">Rent a hall</Link></li>
              <li>
                <Link to="/advertising" className="hover:text-yellow-400 transition-colors">
                  Advertise in our cinemas
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-700 pt-8">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="https://www.facebook.com/" className="hover:text-yellow-400 transition-colors">
              <FaFacebook size={24} />
            </a>
            <a href="https://www.instagram.com/" className="hover:text-yellow-400 transition-colors">
              <FaInstagram size={24} />
            </a>
            <a href="https://www.tiktok.com/" className="hover:text-yellow-400 transition-colors">
              <FaTiktok size={24} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>© INOX Kosovo LLC</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/contact-us" className="hover:text-white">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
