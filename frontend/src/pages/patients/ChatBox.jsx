import { useState, useEffect, useRef } from "react";

const ChatBox = ({ selectedChat }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I assist you?", sender: "bot" },
    { id: 2, text: "I need help with my invoice.", sender: "user" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const userMsg = { id: messages.length + 1, text: newMessage, sender: "user" };
    setMessages([...messages, userMsg]);
    setNewMessage("");

    // Simulating bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: "I'll look into that for you!", sender: "bot" },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">{selectedChat.name}</h2>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 max-w-xs rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-teal-700 text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-orange-500 text-white px-6 py-2 rounded-full">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
