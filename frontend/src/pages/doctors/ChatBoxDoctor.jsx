import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import io from "socket.io-client";
import { jwtDecode } from 'jwt-decode';

const socket = io("http://localhost:5000", { autoConnect: true });

const ChatBoxDoctor = () => {
  const { patientId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      return;
    }

    // Decode token to get doctorId
    const decoded = jwtDecode(token);
    const fetchedDoctorId = decoded.doctorId;
    setDoctorId(fetchedDoctorId);
    console.log("🔹 Doctor ID:", fetchedDoctorId);

    // Register with Socket.io
    socket.emit("register", fetchedDoctorId);
    console.log("🔹 Registered with Socket.io as:", fetchedDoctorId);

    // Listen for connection
    socket.on("connect", () => {
      console.log("✅ Connected to Socket.io server");
    });

    // Listen for new messages
    socket.on("newMessage", (msg) => {
      console.log("🔹 New message received:", msg);
      setMessages((prev) => [...prev, msg]); // Add new message to state
    });

    // Fetch initial chat history
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chat/doctor/history/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ Messages fetched:", response.data);
        setMessages(response.data);
      } catch (error) {
        console.error("❌ Error fetching chat history:", error.response?.data || error);
      }
    };

    fetchMessages();

    // Cleanup listeners
    return () => {
      socket.off("connect");
      socket.off("newMessage");
      console.log("🔹 Cleanup: Removed Socket.io listeners");
    };
  }, [patientId]); // patientId as dependency ensures re-run on route change

  const sendMessage = async () => {
    if (!newMessage.trim() || !patientId) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/chat/doctor/send",
        { patientId, message: newMessage, messageType: "text" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Message sent:", response.data);
      // No need to manually add to state here; Socket.io should handle it
      setNewMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", error.response?.data || error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4">
      <h2 className="text-teal-600 font-bold text-lg mb-4">
        Chat with Patient
      </h2>
      <div className="flex-1 overflow-y-auto p-3 bg-white">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id} // Use unique ID from Chat model
              className={`p-2 my-2 rounded-lg w-fit max-w-xs ${
                msg.senderType === "doctor"
                  ? "bg-teal-200  ml-auto"
                  : "bg-orange-100 mr-auto"
              }`}
            >
              {msg.message || (msg.mediaUrl && <a href={msg.mediaUrl}>Media</a>)}
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

export default ChatBoxDoctor;