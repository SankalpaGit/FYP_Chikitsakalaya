import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientLayout from '../../layouts/PatientLayout';
import InvoiceModal from '../../components/InvoiceModal';

const PostAppointment = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [filter, setFilter] = useState('Active'); // Default is 'Active'

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get('http://localhost:5000/api/invoices/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setInvoices(response.data.invoices || []);
      } catch (err) {
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

  const openModal = (invoice) => setSelectedInvoice(invoice);
  const closeModal = () => setSelectedInvoice(null);

  const getFilteredInvoices = () => {
    const today = new Date();
    return invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      switch (filter) {
        case 'Active':
          return invoiceDate >= today;
        case 'Expired':
          return invoiceDate < today;
        default:
          return true;
      }
    });
  };

  const filteredInvoices = getFilteredInvoices();

  return (
    <PatientLayout>
      <div className="p-10">
        {/* Filter Tabs */}
        <div className="mb-6 flex gap-4">
          {['Active', 'Expired'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 border text-sm font-medium transition ${
                filter === tab
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredInvoices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvoices.map((invoice, index) => (
              <div
                key={index}
                className="relative w-80 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300 p-4 cursor-pointer"
                onClick={() => openModal(invoice)}
              >
                <p className="text-sm text-gray-600">Token: {invoice.tokenNumber}</p>
                <p className="text-sm text-gray-600">
                  Date: {invoice.date} at {invoice.startTime} to {invoice.endTime}
                </p>
                <p className="text-sm text-gray-600">
                  Patient: {invoice.patientFirstName} {invoice.patientLastName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No invoices found for this filter.</p>
        )}

        {selectedInvoice && <InvoiceModal invoice={selectedInvoice} onClose={closeModal} />}
      </div>
    </PatientLayout>
  );
};

export default PostAppointment;
