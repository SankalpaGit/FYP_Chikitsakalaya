import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import PatientLayout from "../../layouts/PatientLayout";

const faqs = [
  { question: "How do I book an appointment?", answer: "You can book an appointment by searching for a doctor using our search feature. Once you find a doctor that fits your needs, you can select a suitable time slot from the available options. After selecting the time slot, you will be directed to the payment page, where you can complete the booking by making a payment. Once your payment is confirmed, you will receive an appointment confirmation via email or SMS, along with further details on how to proceed." },
  { question: "Can I reschedule or cancel my appointment?", answer: "Yes, you have the option to cancel your appointment, but it cannot be canceled on the day of the appointment. If you need to reschedule, you must do so in advance through your user dashboard. Rescheduling is subject to doctor availability. If you need any assistance with rescheduling or cancellations, our customer support team is available to guide you through the process." },
  { question: "What payment methods are accepted?", answer: "We offer multiple payment methods to make the process convenient for all users. If you are an international user, you can make payments via Stripe, which supports a variety of global payment options including credit and debit cards. For Nepali users, we provide Khalti as a payment option, allowing quick and secure transactions using local payment methods. Please ensure that your payment is successful before finalizing your appointment." },
  { question: "What if my appointment is online or physical?", answer: "If you have booked an online appointment, a secure video consultation link will be provided in your appointment details. You can access this link from your appointment page at the scheduled time. If you have opted for a physical appointment, you will receive a token or an invoice, which will be available on your ticket page. Please bring this token or invoice with you when visiting the clinic to ensure a smooth check-in process." },
  { question: "How do I contact customer support?", answer: "Our customer support team is available to assist you with any inquiries or concerns. You can reach out to us through the Contact page on our website, where you will find multiple ways to get in touch, including phone, email, and live chat. Our support team is available during working hours to provide prompt responses and help resolve any issues related to appointments, payments, or technical difficulties." },
  { question: "What is the refund policy?", answer: "Our refund policy is subject to certain conditions. If you cancel your appointment well in advance, you may be eligible for a refund depending on the circumstances. However, if you fail to join or attend the appointment without prior cancellation, the payment will not be refunded. Refund requests are handled on a case-by-case basis, and if you believe you qualify for a refund, please contact our support team for further assistance." }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <PatientLayout>
    <div className="max-w-4xl mx-auto p-8 ">
      <h2 className="text-3xl font-bold text-center mb-8 text-teal-600">Frequently Asked Questions</h2>
      <div className="space-y-6 grid">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-400 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            <button
              className="w-full flex justify-between items-center p-5 bg-teal-50 hover:bg-teal-100 transition-colors"
              onClick={() => toggleFAQ(index)}
            >
              <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
              {openIndex === index ? <FaMinus className="text-teal-600" /> : <FaPlus className="text-teal-600" />}
            </button>
            {openIndex === index && (
              <div className="p-5 bg-white border-t border-gray-300 shadow-inner transition-transform duration-300">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </PatientLayout>
  );
};

export default FAQ;
