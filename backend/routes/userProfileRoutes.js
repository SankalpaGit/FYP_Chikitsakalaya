// routes/userProfileRoutes.js 

const express = require('express'); // import express from express
const upload = require('../config/multer'); // import multer from config as upload

const router = express.Router(); // alias express Router as router

// post routes for the uploading the user report 
router.post('/upload/Report', upload.single('report'),(req, res) => {
    //check if the user uploaded file or not
    if (!req.file) {
        return res.status(404).json({ 
            success: false, 
            message: 'No file uploaded'  // message displayed
        });
    }
    // else if the user uploaded
    res.json({
        success: true,
        message: 'File uploaded successfully', //message displayed
        file: req.file.path
    })
})

router.use(upload.handleFileUploadError);
module.exports = router;