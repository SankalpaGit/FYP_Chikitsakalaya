import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ChatBox = () => {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/chat/messages/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [appointmentId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chat</h2>
      <div className="space-y-3">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="p-3 bg-gray-100 rounded-lg">
              <p>{msg.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatBox;
