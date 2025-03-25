import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";

const ChatBox = () => {
  const { doctorId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `http://localhost:5000/api/chat/history/${doctorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchMessages();
  }, [doctorId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        "http://localhost:5000/api/chat/send",
        {
          recipientId: doctorId,
          message: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4">
      <h2 className="text-teal-600 font-bold text-lg mb-4">
        Chat with Doctor 
      </h2>
      <div className="flex-1 overflow-y-auto  p-3 bg-white">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-2 rounded-lg w-fit max-w-xs ${
                msg.senderId === doctorId
                  ? "bg-gray-200 self-start"
                  : "bg-teal-500 text-white self-end"
              }`}
            >
              {msg.message}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex items-center border rounded-lg p-2">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg outline-none bg-white"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-2 bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700"
          onClick={sendMessage}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
