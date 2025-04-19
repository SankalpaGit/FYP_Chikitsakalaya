import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const InvoiceComponent = ({ invoice }) => {
    const qrData = JSON.stringify({ tokenNumber: invoice.tokenNumber, appointmentId: invoice.appointmentId });

    return (
        <div className="w-full p-4 m-auto font-sans">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-blue-600">Appointment Invoice</h1>
                <p className="text-sm text-gray-500">System-Generated Invoice</p>
            </div>

            {/* QR Code and Invoice Details */}
            <div className="flex justify-between items-center mb-4">
                <div className=''>
                    <p className="  ml-8">
                        Name: {invoice.patientFirstName || ''} {invoice.patientLastName || ''}
                    </p>
                    <p className="  ml-8">Token: {invoice.tokenNumber}</p>
                    <p className="  ml-8">Type: {invoice.appointmentType}</p>
                </div>
                <div className="border-2 border-gray-300 p-2 rounded">
                    <QRCodeSVG value={qrData} size={150} />
                </div>
            </div>

            {/* Appointment Info */}
            <div className="mb-2">
                <h2 className="text-xl font-semibold text-gray-800 border-b-2 ml-2 border-blue-600 pb-5">
                    Appointment Details
                </h2>
                <p className="mt-6 ml-8">Date: {invoice.date}</p>
                <p className='ml-8'>Start Time: {invoice.startTime}</p>
                <p className='ml-8'>End Time: {invoice.endTime}</p>
                <p className='ml-8'>Hospital Affiliation: {invoice.hospitalAffiliation || 'N/A'}</p>
            </div>

            {/* Doctor Info */}
            <div className="mb-2 mt-6">
                <h2 className="text-xl ml-2 font-semibold text-gray-800 border-b-2 border-blue-600 pb-5">
                    Doctor Details
                </h2>
                <p className="mt-2 ml-8">
                    Name: {invoice.doctorFirstName} {invoice.doctorLastName}
                </p>
                <p className='ml-8'>License Number: {invoice.doctorLicenseNumber || 'N/A'}</p>
            </div>
        </div>
    );
};

export default InvoiceComponent;