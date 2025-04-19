import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientLayout from '../../layouts/PatientLayout';
import InvoiceModal from '../../components/InvoiceModal';

const PostAppointment = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get('http://localhost:5000/api/invoices/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API Response:', response.data);
        setInvoices(response.data.invoices || []);
      } catch (err) {
        console.error('Fetch Invoices Error:', err.response || err.message);
        if (err.response?.status === 401) {
          setError('Please log in again to view your invoices.');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to load invoices');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const openModal = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
  };

  return (
    <PatientLayout>
      <div className="p-10">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : invoices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.map((invoice, index) => (
              <div
                key={index}
                className="relative w-80 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300 p-4 cursor-pointer"
                onClick={() => openModal(invoice)}
              >
               
                <p className="text-sm text-gray-600">Token: {invoice.tokenNumber}</p>
                <p className="text-sm text-gray-600">Date: {invoice.date} at {invoice.startTime} to {invoice.endTime} </p>
                <p className="text-sm text-gray-600">
                  Patient: {invoice.patientFirstName} {invoice.patientLastName}
                </p>
                
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No invoices found for paid physical appointments.</p>
        )}

        {selectedInvoice && <InvoiceModal invoice={selectedInvoice} onClose={closeModal} />}
      </div>
    </PatientLayout>
  );
};

export default PostAppointment;