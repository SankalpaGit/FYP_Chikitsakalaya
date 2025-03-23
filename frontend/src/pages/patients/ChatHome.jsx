import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ChatHome = () => {
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const token = localStorage.getItem("token"); 
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5000/api/chat/doctors", {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        
        setChatList(response.data);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };
    
    fetchChats();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <div className="space-y-3">
        {chatList.length === 0 ? (
          <p>No chats available</p>
        ) : (
          chatList.map((chat) => (
            <div
              key={chat.appointmentId}
              className="p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => navigate(`/chat/${chat.appointmentId}`)} // Link to the specific appointment
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


export default ChatHome;
