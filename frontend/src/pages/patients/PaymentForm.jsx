import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}:${minute} ${ampm}`;
};

const PaymentForm = ({ clientSecret, paymentIntentId, amount, appointmentData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setIsProcessing(true);

        if (!stripe || !elements) {
            setError("Stripe has not loaded yet.");
            toast.error("Stripe has not loaded yet.", { autoClose: 3000 });
            setIsProcessing(false);
            return;
        }

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) },
            });

            if (error) {
                setError(error.message);
                toast.error(error.message, { autoClose: 3000 });
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                setSuccess(true);
                toast.success("Payment successful! Confirming appointment...", { autoClose: 3000 });

                // Update payment status and create appointment
                try {
                    const response = await axios.post(`http://localhost:5000/api/payment/update-status`, {
                        paymentIntentId,
                        paymentStatus: "paid",
                    });

                    console.log("Update status response:", response.data);

                    if (response.data.success) {
                        toast.success("Appointment confirmed!", { autoClose: 3000 });
                        setTimeout(() => {
                            navigate('/appointments');
                        }, 2000);
                    } else {
                        // If appointment was created, navigate anyway
                        if (response.data.appointmentId) {
                            toast.warn("Appointment created but payment or notification record may be incomplete. Contact support.", { autoClose: 3000 });
                            setTimeout(() => {
                                navigate('/appointments');
                            }, 2000);
                        } else {
                            setError(response.data.message || "Failed to confirm appointment.");
                            toast.error(response.data.message || "Failed to confirm appointment.", { autoClose: 3000 });
                        }
                    }
                } catch (updateError) {
                    console.error("Update status error:", updateError);
                    setError(updateError.response?.data?.message || "Server error during appointment confirmation.");
                    toast.error(updateError.response?.data?.message || "Server error during appointment confirmation.", { autoClose: 3000 });
                    // Navigate anyway since appointment is likely created
                    toast.warn("Appointment may have been created. Contact support if you encounter issues.", { autoClose: 3000 });
                    setTimeout(() => {
                        navigate('/appointments');
                    }, 2000);
                }
            } else {
                setError("Payment not completed.");
                toast.error("Payment not completed.", { autoClose: 3000 });
            }
        } catch (err) {
            console.error("Payment processing error:", err);
            const errorMsg = err.response?.data?.message || err.message || "Server error during payment processing.";
            setError(errorMsg);
            toast.error(errorMsg, { autoClose: 3000 });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
       
            <div className="space-y-4">
                {/* Display Appointment Details */}
                {appointmentData && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Appointment Details</h3>
                        <p><strong>Date:</strong> {new Date(appointmentData.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {formatTime(appointmentData.StartTime)} - {formatTime(appointmentData.EndTime)}</p>
                        <p><strong>Type:</strong> {appointmentData.appointmentType}</p>
                        {appointmentData.hospitalAffiliation && (
                            <p><strong>Location:</strong> {appointmentData.hospitalAffiliation}</p>
                        )}
                        <p><strong>Reason:</strong> {appointmentData.description}</p>
                        <p><strong>Fee:</strong> <span className="text-green-600">${appointmentData.consultationFee}</span></p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Total: <span className="text-green-600">${amount}</span></h2>

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
                    {success && <p className="text-green-600 font-semibold">Payment Successful!</p>}

                    <button
                        type="submit"
                        disabled={isProcessing || !stripe}
                        className={`w-full py-2 rounded-lg text-white font-bold transition duration-200 ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-teal-500 hover:bg-blue-600"}`}
                    >
                        {isProcessing ? "Processing..." : "Pay Now"}
                    </button>
                </form>
            </div>
    );
};

export default PaymentForm;