import React, { useState, useEffect } from "react";
import useChat from "../../hook/useChat";

const ChatBoxDoctor = ({ userId, chatId }) => {
  const { messages, fetchChatHistory, sendMessage } = useChat(userId);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (chatId) {
      fetchChatHistory(chatId);
    }
  }, [chatId]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(chatId, userId, message);
      setMessage("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <p key={index}><strong>{msg.senderId === userId ? "You" : "Patient"}:</strong> {msg.message}</p>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatBoxDoctor;
