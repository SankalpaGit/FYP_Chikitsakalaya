import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatHomeDoctor = () => {
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await axios.get("http://localhost:5000/api/chat/doctor/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatList(response.data); // Expecting [{ patientId, firstName, lastName }]
      } catch (error) {
        console.error("Error fetching patients chat list:", error.response?.data || error);
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
              key={chat.patientId} // Use patientId as key
              className="p-3 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => navigate(`/doctor/chat/${chat.patientId}`)}
            >
              <p className="font-semibold">
                {chat.firstName} {chat.lastName}
              </p>
              <p className="text-sm text-gray-600">
                {chat.lastMessage || "Tap to start chatting..."}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatHomeDoctor;