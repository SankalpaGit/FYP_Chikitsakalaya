const app = require('./app');
const PORT = process.env.PORT || 5000;
const WEBRTC_CONFIG = require("./config/webrtcConfig");

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
server.listen(WEBRTC_CONFIG.SIGNALING_PORT, () => {
  console.log(`WebRTC Signaling Server running on port ${WEBRTC_CONFIG.SIGNALING_PORT}`);
});