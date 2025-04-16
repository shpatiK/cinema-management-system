import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-gray-700">
            We collect personal information when you register, make purchases, or interact with our services.
            This may include your name, email address, payment details, and movie preferences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-700">
            Your information is used to process transactions, improve our services, and communicate with you.
            We may send promotional emails about new movies or special offers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
          <p className="text-gray-700">
            We implement security measures to protect your personal information.
            All transactions are encrypted using SSL technology.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this policy periodically. Any changes will be posted on this page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;