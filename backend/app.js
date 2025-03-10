const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors'); 
const path = require('path');
const http = require('http');
const sequelize = require('./config/database'); // Import the configured sequelize instance
require('./config/passportConfig'); // Initialize Passport strategies
const { Server } = require("socket.io");
const WEBRTC_CONFIG = require("./config/webrtcConfig");

// import of the all model 
const RegisterDoctor = require('./models/RegisterDoctor'); 
const Admin = require('./models/Admin'); 
const Doctor = require('./models/Doctor'); 
const Patient = require('./models/Patient'); 
const PatientReport = require('./models/PatientReport');
const TimeSlot = require('./models/TimeSlot');
const index = require('./models/index');

// imports of the all routes file
const doctorRoutes = require('./routes/doctorRegistrationRoutes'); 
const adminLoginRoute = require('./routes/adminRoutes')
const googleOAuthRoute = require('./routes/googleOAuthRoutes')
const patientAuthRoute = require('./routes/patientAuthRoutes')
const userProfileRoute = require('./routes/userProfileRoutes')
const doctorProfileRoute = require('./routes/doctorProfileRoutes')
const userListingRoute = require('./routes/userListingRoutes')
const searchDoctorRoute = require('./routes/searchDoctorRoutes')
const doctorTimeSlotRoute = require('./routes/doctotTimeSlotRoutes')
const appointmentRoute = require('./routes/appointmenrRoutes')
const paymentRoute = require('./routes/paymentRoutes')
const getAppointmentRoute = require('./routes/getAppointmentRoutes')
const physicalTicketRoute = require('./routes/physicalTicketRoutes')
// configuration of the dotenv variable
dotenv.config();

const app = express();

app.use(cors({origin: 'http://localhost:5173'}));  // Enable CORS for all routes and origins


app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Use of the route
app.use('/api', doctorRoutes); // Prefix with '/api' or any base URL 
app.use('/api', adminLoginRoute)
app.use('/api', googleOAuthRoute)
app.use('/api', patientAuthRoute)
app.use('/api', userProfileRoute)
app.use('/api', doctorProfileRoute)
app.use('/api', userListingRoute)
app.use('/api', searchDoctorRoute)
app.use('/api', doctorTimeSlotRoute)
app.use('/api', appointmentRoute)
app.use('/api/payment', paymentRoute)
app.use('/api' , getAppointmentRoute)
app.use('/api', physicalTicketRoute)

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: WEBRTC_CONFIG.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

console.log("Allowed frontend URL:", WEBRTC_CONFIG.FRONTEND_URL);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins a room
  socket.on("join-room", (roomId) => {
    if (!roomId) return console.error("Room ID is undefined!");
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);
  });

  // Handle WebRTC Offer
  socket.on("offer", ({ roomId, offer }) => {
    console.log(`Received offer for room: ${roomId}`);
    if (!roomId || !offer) return console.error("Invalid offer data!");
    socket.to(roomId).emit("offer", offer);
  });

  // Handle WebRTC Answer
  socket.on("answer", ({ roomId, answer }) => {
    console.log(`Received answer for room: ${roomId}`);
    if (!roomId || !answer) return console.error("Invalid answer data!");
    socket.to(roomId).emit("answer", answer);
  });

  // Handle ICE Candidates
  socket.on("ice-candidate", ({ roomId, candidate }) => {
    if (!candidate) return console.warn("Received an invalid ICE candidate");
    console.log(`ICE candidate received for room: ${roomId}`);
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  // Handle Disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Authenticate and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync(); // Sync all models means create the database table
  })
  .then(() => {
    console.log('Models synced successfully.'); //debugging 
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err); // debugging
  });

app.get('/', (req, res) => {
  res.send('Chikitsakalaya server is running'); // sending the response
});

module.exports = app;
