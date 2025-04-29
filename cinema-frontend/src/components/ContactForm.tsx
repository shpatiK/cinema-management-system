// src/modules/auth/components/ContactForm.tsx
import React from 'react';

interface ContactFormProps {
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onClose }) => {
  return (
    <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
      <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
      <form className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Company"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <textarea
            placeholder="Message"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>
        <div className="border-t pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close contact form"
      >
        ✕
      </button>
    </div>
  );
};

export default ContactForm;