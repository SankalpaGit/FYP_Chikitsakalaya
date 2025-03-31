// config/webrtcConfig.js

require("dotenv").config();

const WEBRTC_CONFIG = {
  SIGNALING_PORT: process.env.SIGNALING_PORT || 5000,  // Use 5050 for WebRTC signaling
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};

module.exports = WEBRTC_CONFIG;
