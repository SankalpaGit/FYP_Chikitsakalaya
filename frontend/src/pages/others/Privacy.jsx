import React from "react";
import PatientLayout from "../../layouts/PatientLayout";

const Privacy = () => {
  return (
    <PatientLayout>
      <div className="max-w-4xl mx-auto p-6  shadow-md rounded-lg mt-6 mb-6">
        <h1 className="text-3xl font-bold text-teal-700 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-6">Effective Date: 2025-26</p>

        <p className="text-gray-700 mb-4">
          Welcome to <strong>Chikitsakalaya</strong>. We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your data.
        </p>

        <h2 className="text-xl font-semibold text-teal-700 mt-4">1. Information We Collect</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li><strong>Personal Information:</strong> Name, email, phone number, DOB, gender, and address.</li>
          <li><strong>Medical Data:</strong> Appointment details, prescriptions, and health records.</li>
          <li><strong>Payment Information:</strong> Handled securely via third-party gateways.</li>
          <li><strong>Usage Data:</strong> IP address, browser type, and logs.</li>
        </ul>

        <h2 className="text-xl font-semibold text-teal-700 mt-4">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>To manage online & physical appointments.</li>
          <li>To generate meeting links for online consultations.</li>
          <li>To process payments securely.</li>
          <li>To allow doctors to provide prescriptions.</li>
        </ul>

        <h2 className="text-xl font-semibold text-teal-700 mt-4">3. Data Sharing & Security</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Your data is never sold or shared without consent.</li>
          <li>Payment details are securely processed via **[Payment Gateway Name]**.</li>
          <li>Secure authentication & encryption protect your data.</li>
        </ul>

        <h2 className="text-xl font-semibold text-teal-700 mt-4">4. Doctor Registration & Approval</h2>
        <p className="text-gray-700">Doctors must provide documents for verification. Admins review and approve or reject applications.</p>

        <h2 className="text-xl font-semibold text-teal-700 mt-4">5. Your Rights</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Access, update, or delete your account.</li>
          <li>Request a copy of your health records.</li>
          <li>Opt-out of marketing communications.</li>
        </ul>

        <p className="text-gray-700 mt-6">
          For privacy concerns, contact <strong>support@chikitsakalaya.com</strong>.
        </p>
      </div>
    </PatientLayout>
  );
};

export default Privacy;
