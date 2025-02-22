// PaymentHome.jsx
import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm"; // Correct import for default export

const PaymentHome = ({ appointmentId }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/payment/create-payment-intent`,
          {
            appointmentId,
            amount: 50.00, // Pass the actual amount based on the appointment
          }
        );
        if (response.data.success) {
          setClientSecret(response.data.clientSecret);
        }
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    fetchClientSecret();
  }, [appointmentId]);

  return (
    <Elements stripe={stripePromise}>
      <div>
        {clientSecret ? (
          <PaymentForm clientSecret={clientSecret} appointmentId={appointmentId} amount={50.00} />
        ) : (
          <p>Loading payment details...</p>
        )}
      </div>
    </Elements>
  );
};

export default PaymentHome;
