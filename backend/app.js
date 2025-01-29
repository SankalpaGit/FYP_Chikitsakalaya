const express = require('express');
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors'); 
const sequelize = require('./config/database'); // Import the configured sequelize instance
require('./config/passportConfig'); // Initialize Passport strategies

// import of the all model 
const RegisterDoctor = require('./models/RegisterDoctor'); 
const Admin = require('./models/Admin'); 
const Doctor = require('./models/Doctor'); 
const Patient = require('./models/Patient'); 

// imports of the all routes file
const doctorRoutes = require('./routes/doctorRegistrationRoutes'); 
const adminLoginRoute = require('./routes/adminRoutes')
const googleOAuthRoute = require('./routes/googleOAuthRoutes')
const patientAuthRoute = require('./routes/patientAuthRoutes')
const userProfileRoute = require('./routes/userProfileRoutes')

// configuration of the dotenv variable
dotenv.config();

const app = express();

app.use(cors());  // Enable CORS for all routes and origins

app.use(express.json());

// Use of the route
app.use('/api', doctorRoutes); // Prefix with '/api' or any base URL 
app.use('/api', adminLoginRoute)
app.use('/api', googleOAuthRoute)
app.use('/api', patientAuthRoute)
app.use('/api', userProfileRoute)

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
