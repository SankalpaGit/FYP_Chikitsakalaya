import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatHomeDoctor = () => {
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/chat/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatList(response.data);
      } catch (error) {
        console.error("Error fetching patients chat list:", error);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="p-4 mt-16">
      <div className="space-y-3">
        {chatList.length === 0 ? (
          <p>No chats available</p>
        ) : (
          chatList.map((chat) => (
            <div
              key={chat.appointmentId}
              className="p-3 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => navigate(`/doctor/chat/${chat.patientId}`)} // Link to the specific appointment
            >
              <p className="font-semibold">Dr. {chat.firstName} {chat.lastName}</p>
              <p className="text-sm text-gray-600">{chat.lastMessage || "Tap to start chatting..."}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHomeDoctor;
