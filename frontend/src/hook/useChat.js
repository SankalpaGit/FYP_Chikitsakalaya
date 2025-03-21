// hooks/useChat.js

import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const useChat = (userId) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  // Fetch chat list
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/chat/list`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setChats(response.data.chats);
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };
    fetchChats();
  }, [userId]);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/chat/user-details`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserDetails(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [userId]);

  // Fetch chat history
  const fetchChatHistory = async (chatId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/history/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Create a new chat
  const createChat = async (doctorId, patientId, appointmentId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/create`,
        { doctorId, patientId, appointmentId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return response.data.chatId;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  };

  // Send a message
  const sendMessage = async (chatId, senderId, message) => {
    try {
      await axios.post(
        `${API_BASE_URL}/chat/send`,
        { chatId, senderId, message },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchChatHistory(chatId); // Refresh chat after sending message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return { chats, messages, userDetails, fetchChatHistory, createChat, sendMessage };
};

export default useChat;
