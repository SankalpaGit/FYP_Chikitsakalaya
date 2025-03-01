import React from "react";

const ChatBox = ({ selectedTicket }) => {
  if (!selectedTicket) return <p className="p-4">Select an invoice to view details.</p>;

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Invoice Details</h2>
      <div className="bg-blue-100 p-3 rounded-lg">
        <p className="font-semibold">🎟 Appointment Invoice</p>
        <p>Token Number: {selectedTicket.tokenNumber}</p>
        <a
          href={selectedTicket.pdfLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
};

export default ChatBox;
