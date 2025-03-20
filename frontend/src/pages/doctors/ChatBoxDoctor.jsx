import React, { useState } from "react";
import axios from "axios";

const ChatBoxDoctor = ({ selectedChat }) => {
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      senderId: 1,  // Replace with dynamic user ID
      recipientId: selectedChat.userId,
      message: newMessage,
      senderType: "doctor",
      recipientType: "patient",
      appointmentId: selectedChat.id, // Use appointment ID
    };

    axios
      .post("/api/chat/send", messageData)
      .then((response) => {
        setNewMessage("");  // Clear message input
        console.log(response.data); // Handle success response
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{selectedChat.name}</h2>
      {/* Messages container (static for now) */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {/* Add dynamic messages here */}
      </div>

      {/* Input Field */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="bg-orange-500 text-white px-6 py-2 rounded-full">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBoxDoctor;
