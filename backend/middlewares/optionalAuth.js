const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Received Authorization header:', authHeader || 'None');
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token || 'None');
  console.log('JWT_SECRET:', secretKey || 'Undefined');

  if (!token) {
    console.log('No token provided, proceeding unauthenticated');
    return next();
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log('Decoded token payload:', decoded);
    req.user = decoded;
  } catch (err) {
    console.warn('Token verification failed:', err.message);
  }

  next();
};

module.exports = optionalAuth;