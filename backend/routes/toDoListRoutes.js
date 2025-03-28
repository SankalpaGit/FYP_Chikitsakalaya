const express = require('express');
const router = express.Router();
const Task = require('../models/TaskList');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');
const Doctor = require('../models/Doctor');  // Assuming you are using this for your patient model

// Add a new task (only for the logged-in doctor)// Add a new task (only for the logged-in doctor)
router.post('/add/task', verifyToken,async (req, res) => {
    try {
      // Extract and verify token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
          return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }

      let decoded;
      try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded; // Store decoded token in req.user
          console.log("Decoded user:", decoded);
      } catch (err) {
          return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
      // Update Doctor Basic Info
      const doctor = await Doctor.findByPk(req.user.doctorId);
      if (!doctor) {
          return res.status(404).json({ success: false, message: "Doctor not found" });
      }
      const { title, description, status, deadline } = req.body;
      const newTask = await Task.create({
        title,
        description,
        status,
        deadline,
        doctorId: decoded.doctorId, // Use decoded ID for the doctorId field
      });
  
      res.status(201).json({ message: 'Task added successfully', task: newTask });
    } catch (error) {
      res.status(500).json({ message: 'Error adding task', error: error.message });
    }
  });
  

// Get all tasks for logged-in doctor
// Get all tasks for logged-in doctor
router.get('/get/task', verifyToken, async (req, res) => {
    try {
      // Extract and verify token (handled by the middleware verifyToken)
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store decoded token in req.user
      } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
  
      // Find all tasks for the logged-in doctor
      const tasks = await Task.findAll({ where: { doctorId: decoded.doctorId } });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  });
  

// Delete tasks for logged-in doctor
// Delete tasks for logged-in doctor
router.delete('/delete/task/:id', verifyToken, async (req, res) => {
    try {
      // Extract and verify token (handled by the middleware verifyToken)
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store decoded token in req.user
      } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
  
      // Extract taskId from URL parameter
      const taskId = req.params.id;
  
      // Find the task for this doctor
      const task = await Task.findOne({ where: { id: taskId, doctorId: decoded.doctorId } });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Destroy the task
      await task.destroy();
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
  });
  


// Update tasks for logged-in doctor
router.put('/update/task/:id', verifyToken, async (req, res) => {
    try {
      // Extract and verify token (handled by the middleware verifyToken)
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Store decoded token in req.user
      } catch (err) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
      }
  
      // Extract taskId from URL parameter
      const taskId = req.params.id;
      const { title, description, status, deadline } = req.body;
  
      // Find the task for this doctor
      const task = await Task.findOne({ where: { id: taskId, doctorId: decoded.doctorId } });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Update task fields
      await task.update({ title, description, status, deadline });
      res.json({ message: 'Task updated successfully', task });
    } catch (error) {
      res.status(500).json({ message: 'Error updating task', error: error.message });
    }
  });
  

module.exports = router;
