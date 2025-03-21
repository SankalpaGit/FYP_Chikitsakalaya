import React, { useState } from "react";
import useChat from "../../hook/useChat";

const ChatHomeDoctor = ({ userId }) => {
  const { chats, userDetails } = useChat(userId);
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div>
      <h2>Patients</h2>
      {chats.length > 0 ? (
        chats.map((chat) => (
          <div key={chat.id} onClick={() => setSelectedChat(chat)}>
            <p>Chat with {chat.Patient.firstName} {chat.Patient.lastName}</p>
          </div>
        ))
      ) : (
        <p>No chats available</p>
      )}
    </div>
  );
};

export default ChatHomeDoctor;
