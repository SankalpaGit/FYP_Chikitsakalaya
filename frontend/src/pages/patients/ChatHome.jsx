import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatHome = () => {
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/chat/patient/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Doctors fetched:", response.data);
        setChatList(response.data); // Expecting [{ doctorId, firstName, lastName }]
      } catch (error) {
        console.error("Error fetching chat list:", error.response?.data || error);
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
              key={chat.doctorId} // Use doctorId as key
              className="p-3 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => navigate(`/chat/${chat.doctorId}`)}
            >
              <p className="font-semibold">Dr. {chat.firstName} {chat.lastName}</p>
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

export default ChatHome;