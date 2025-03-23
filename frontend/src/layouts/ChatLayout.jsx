import React from "react";
import { Outlet } from "react-router-dom";
import ChatHome from "../pages/patients/ChatHome";

const ChatLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-100 border-r">
        <ChatHome />
      </div>
      {/* Chat Area */}
      <div className="flex-1">
        <Outlet /> {/* Renders ChatBox when a doctor is selected */}
      </div>
    </div>
  );
};

export default ChatLayout;
