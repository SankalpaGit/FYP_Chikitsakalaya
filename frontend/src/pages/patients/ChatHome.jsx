import React, { useState } from "react";
import useChat from "../../hook/useChat";

const ChatHome = ({ userId }) => {
  const { chats, userDetails } = useChat(userId);
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div>
      <h2>Chats</h2>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div key={chat.id} onClick={() => setSelectedChat(chat)}>
            <p>Chat with Dr. {chat.Doctor.firstName} {chat.Doctor.lastName}</p>
          </div>
        ))
      ) : (
        <p>No chats available</p>
      )}
    </div>
  );
};

export default ChatHome;
