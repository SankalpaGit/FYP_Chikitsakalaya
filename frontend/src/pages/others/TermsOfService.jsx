import React from "react";
import PatientLayout from "../../layouts/PatientLayout";

const TermsOfService = () => {
    return (
        <PatientLayout>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
                <h1 className="text-3xl font-bold text-teal-700 mb-4">Terms of Service</h1>
                <p className="text-gray-600 mb-6">Effective Date: [Insert Date]</p>

                <p className="text-gray-700 mb-4">
                    By using <strong>Chikitsakalaya</strong>, you agree to these terms. If you do not agree, please do not use our services.
                </p>

                <h2 className="text-xl font-semibold text-teal-700 mt-4">1. Services Offered</h2>
                <ul className="list-disc ml-6 text-gray-700">
                    <li>Patients can book <strong>online & physical</strong> doctor appointments.</li>
                    <li>Doctors must register and require <strong>admin approval</strong>.</li>
                    <li>Online consultations generate a <strong>meeting link</strong>, while physical appointments generate a <strong>token number</strong>.</li>
                    <li>Doctors can <strong>provide prescriptions</strong> through the platform.</li>
                </ul>

                <h2 className="text-xl font-semibold text-teal-700 mt-4">2. Payments & Refunds</h2>
                <ul className="list-disc ml-6 text-gray-700">
                    <li>Payments are required at the time of booking.</li>
                    <li>Refunds are issued only for cancellations made at least <strong>[X hours]</strong> in advance.</li>
                    <li>Payments are processed securely through **[Payment Gateway Name]**.</li>
                </ul>

                <h2 className="text-xl font-semibold text-teal-700 mt-4">3. Doctor Responsibilities</h2>
                <ul className="list-disc ml-6 text-gray-700">
                    <li>Maintain professionalism and ethical medical standards.</li>
                    <li>Provide accurate and responsible medical guidance.</li>
                    <li>Do not share patient data outside the platform.</li>
                </ul>

                <h2 className="text-xl font-semibold text-teal-700 mt-4">4. Patient Responsibilities</h2>
                <ul className="list-disc ml-6 text-gray-700">
                    <li>Provide accurate personal and health details.</li>
                    <li>Attend scheduled appointments on time.</li>
                    <li>Follow prescribed treatments responsibly.</li>
                </ul>

                <h2 className="text-xl font-semibold text-teal-700 mt-4">5. Account Suspension & Termination</h2>
                <p className="text-gray-700">
                    We reserve the right to suspend or terminate accounts involved in fraud, misbehavior, or violations of these terms.
                </p>

                <h2 className="text-xl font-semibold text-teal-700 mt-4">6. Changes to Terms</h2>
                <p className="text-gray-700">
                    We may update these terms at any time. Continued use of the platform means you accept the new terms.
                </p>

                <p className="text-gray-700 mt-6">
                    For any questions, contact <strong>support@chikitsakalaya.com</strong>.
                </p>
            </div>
        </PatientLayout>
    );
};

export default TermsOfService;
