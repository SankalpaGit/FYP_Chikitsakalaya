import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

const PaymentForm = ({ clientSecret, appointmentID, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsProcessing(true);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true);
        console.log("Payment successful!");

        // ✅ Update payment status to "paid" in backend
        await axios.post(`http://localhost:5000/api/payment/update-status`, {
          appointmentId: appointmentID,
          paymentStatus: "paid",
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Total: <span className="text-green-600">${amount}</span></h2>

      {/* ✅ Card Element with Tailwind Styling */}
      <div className="border p-3 rounded-lg bg-gray-50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": { color: "#aab7c4" },
              },
              invalid: { color: "#fa755a" },
            },
          }}
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500 font-semibold">Payment Successful!</p>}

      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className={`w-full py-2 rounded-lg text-white font-bold transition duration-200 ${
          isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-teal-500 hover:bg-blue-600"
        }`}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default PaymentForm;
