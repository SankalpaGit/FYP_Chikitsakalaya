import React from 'react'
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ChatHomeDoctor from '../pages/doctors/chatHomeDoctor';
import DoctorLayout from '../layouts/DoctorLayout';

const DoctorChatLayout = () => {

    const [selectedChat, setSelectedChat] = useState(null);

  return (
    <DoctorLayout>
    <div className="flex h-screen bg-white">
        {/* Sidebar */}
        <div className="w-1/4 bg-white border-r">
          <ChatHomeDoctor />
        </div>

        {/* Chat Area with Scrolling */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <Outlet /> 
          </div>
        </div>
      </div>
      </DoctorLayout>
  )
}

export default DoctorChatLayout
