import React from "react";
import { Outlet } from "react-router-dom";
import ChatHome from "../pages/patients/ChatHome";
import NavBar from "../components/nav/NavBar";

const ChatLayout = () => {
  return (
    <>
      <NavBar />
      <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r">
          <ChatHome />
        </div>

        {/* Chat Area with Scrolling */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <Outlet /> {/* Renders ChatBox when a doctor is selected */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatLayout;
