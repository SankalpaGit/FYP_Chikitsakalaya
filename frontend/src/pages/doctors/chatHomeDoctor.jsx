import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatBoxDoctor from "./ChatBoxDoctor";

const ChatHomeDoctor = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    // Fetch chats for the doctor
    axios
      .get("/api/chat/chats", { params: { userId: 1, userType: "doctor" } }) // Replace '1' with dynamic user ID
      .then((response) => setChats(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/4 bg-white p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Recent Chats</h2>
        <ul className="space-y-2">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={`p-3 rounded-lg cursor-pointer transition ${
                selectedChat?.id === chat.id
                  ? "bg-teal-500 text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              {chat.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Box */}
      <div className="flex-1 flex flex-col p-4">
        {selectedChat ? (
          <ChatBoxDoctor selectedChat={selectedChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHomeDoctor;
