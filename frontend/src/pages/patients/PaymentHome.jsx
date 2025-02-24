import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import axios from "axios";
import { useParams } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentHome = () => {
  const { appointmentID } = useParams();
  const [clientSecret, setClientSecret] = useState(null);
  const [amount, setAmount] = useState(null);

  useEffect(() => {
    let isMounted = true; // ✅ Prevents duplicate API calls

    const fetchPaymentDetails = async () => {
      try {
        console.log("Sending appointmentID:", appointmentID);
    
        if (!appointmentID) {
          console.error("Error: appointmentID is undefined!");
          return;
        }

        const response = await axios.post(
          `http://localhost:5000/api/payment/create-payment-intent`,
          { appointmentId: appointmentID }
        );

        if (isMounted) { 
          console.log("Payment response:", response.data);
          if (response.data.success) {
            setClientSecret(response.data.clientSecret);
            setAmount(response.data.amount);
          }
        }
      } catch (error) {
        console.error("Error fetching client secret:", error);
      }
    };

    fetchPaymentDetails();

    return () => { isMounted = false }; // ✅ Cleanup function
  }, [appointmentID]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Payment</h2>
        <Elements stripe={stripePromise}>
          {clientSecret && amount !== null ? (
            <PaymentForm clientSecret={clientSecret} appointmentID={appointmentID} amount={amount} />
          ) : (
            <p className="text-center text-gray-500">Loading payment details...</p>
          )}
        </Elements>
      </div>
    </div>
  );
};

export default PaymentHome;
