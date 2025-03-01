import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatHome = ({ patientId, onSelectChat }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get(`/tickets/patient/${patientId}`);
        setTickets(data.tickets);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, [patientId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Appointments & Invoices</h2>
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="flex items-center justify-between p-3 mb-2 border-b cursor-pointer hover:bg-gray-100"
          onClick={() => onSelectChat(ticket)}
        >
          <div className="flex-1">
            <h3 className="font-semibold text-blue-600">Invoice #{ticket.id}</h3>
            <p className="text-sm text-gray-600">Token: {ticket.tokenNumber}</p>
          </div>
          <a
            href={ticket.pdfLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View PDF
          </a>
        </div>
      ))}
    </div>
  );
};

export default ChatHome;
