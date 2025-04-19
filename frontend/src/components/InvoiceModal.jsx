import React from 'react';
import InvoiceComponent from './InvoiceComponent';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaDownload, FaTimes } from 'react-icons/fa';

const InvoiceModal = ({ invoice, onClose }) => {
    const downloadPDF = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const element = document.getElementById('invoice-content');

        // Get the visible content height using getBoundingClientRect
        const { width: contentWidth, height: contentHeight } = element.getBoundingClientRect();

        // Capture the content with html2canvas
        const canvas = await html2canvas(element, {
            scale: 1,
            width: contentWidth,
            height: contentHeight,
            windowWidth: contentWidth,
            windowHeight: contentHeight,
        });

        const imgData = canvas.toDataURL('image/png');

        // Initialize jsPDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
        });

        // Adjust for DPI (browser at 96 DPI, PDF at 72 DPI)
        const dpiScale = 72 / 96;
        const imgWidth = (contentWidth * dpiScale) / 3.78; // Width in mm
        const imgHeight = (contentHeight * dpiScale) / 3.78; // Height in mm

        // Set PDF dimensions to match content
        const pdfWidth = imgWidth;
        const pdfHeight = imgHeight;

        // Add image to PDF with no offset
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`invoice-${invoice.appointmentId}.pdf`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Invoice Details</h2>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={downloadPDF}
                            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <FaDownload className="mr-1" /> Download
                        </button>
                        <button
                            onClick={onClose}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Close"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>

                <div id="invoice-content" className="overflow-hidden">
                    <InvoiceComponent invoice={invoice} />
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;