const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); 
const path = require('path');
const sequelize = require('./config/database'); // Import the configured sequelize instance
require('./config/passportConfig'); // Initialize Passport strategies
const WEBRTC_CONFIG = require('./config/webrtcConfig');


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: WEBRTC_CONFIG.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

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
const blogRoute = require('./routes/blogRoutes')
const chatRoute = require('./routes/chatRoutes')
const tasksRoute = require('./routes/toDoListRoutes')
const OnlinePortalRoute = require('./routes/onlinePortalRoutes')
const appointmentStatusRoute = require('./routes/appointmentStatusRoutes')
const prescriptionRoute= require('./routes/prescriptionRoutes')
app.use('/verify-ticket', require('./routes/verifyTicket'));
// configuration of the dotenv variable
dotenv.config();



app.use(
  cors({
    origin: "http://localhost:5173",  // Allow frontend origin
    credentials: true,  // Allow cookies & authentication headers
  })
);

app.use((req, res, next) => {
  if (!req.io) console.warn('⚠️ Socket.io not injected yet');
  next();
});

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
app.use('/api', blogRoute)
app.use('/api', chatRoute)
app.use('/api', tasksRoute)
app.use('/api', OnlinePortalRoute)
app.use('/api', appointmentStatusRoute)
app.use('/api', prescriptionRoute)

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

module.exports = { app, server, io };
