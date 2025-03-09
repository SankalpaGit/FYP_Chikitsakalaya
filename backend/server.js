const app = require('./app');
const PORT = process.env.PORT || 5000;
const http = require('http');
const WEBRTC_CONFIG = require("./config/webrtcConfig");

const server = http.createServer(app);
app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
server.listen(WEBRTC_CONFIG.SIGNALING_PORT, () => {
  console.log(`WebRTC Signaling Server running on port ${WEBRTC_CONFIG.SIGNALING_PORT}`);
});