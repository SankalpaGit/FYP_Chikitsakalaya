import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import PatientLayout from "../../layouts/PatientLayout";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentHome = () => {
    const { doctorId } = useParams();
    const location = useLocation();
    const appointmentData = location.state?.appointmentData;
    const [clientSecret, setClientSecret] = useState(null);
    const [amount, setAmount] = useState(null);
    const [paymentIntentId, setPaymentIntentId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchPaymentDetails = async () => {
            if (!appointmentData || !doctorId) {
                console.error("Error: Missing appointment data or doctorId");
                setError("Invalid payment request. Please try booking again.");
                return;
            }

            try {
                const response = await axios.post(
                    `http://localhost:5000/api/payment/create-payment-intent`,
                    appointmentData
                );

                if (isMounted) {
                    console.log("Payment response:", response.data);
                    if (response.data.success) {
                        setClientSecret(response.data.clientSecret);
                        setAmount(response.data.amount);
                        setPaymentIntentId(response.data.paymentIntentId);
                    } else {
                        setError(response.data.message || "Failed to initialize payment.");
                    }
                }
            } catch (error) {
                console.error("Error fetching client secret:", error);
                setError(error.response?.data?.message || "Server error: Could not initialize payment.");
            }
        };

        fetchPaymentDetails();

        return () => { isMounted = false };
    }, [appointmentData, doctorId]);

    return (
        <PatientLayout>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Payment for Appointment</h2>
                {error ? (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                ) : (
                    <Elements stripe={stripePromise}>
                        {clientSecret && amount !== null && paymentIntentId ? (
                            <PaymentForm
                                clientSecret={clientSecret}
                                paymentIntentId={paymentIntentId}
                                amount={amount}
                                appointmentData={appointmentData}
                            />
                        ) : (
                            <p className="text-center text-gray-500">Loading payment details...</p>
                        )}
                    </Elements>
                )}
            </div>
        </div>
        </PatientLayout>
    );
};

export default PaymentHome;