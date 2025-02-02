// routes/userProfileRoutes.js 

// This routes is the specific implementation for the OCR Based User Profile

const express = require('express'); // import express from express
const upload = require('../config/multer'); // import multer from config as upload
const router = express.Router(); // alias express Router as router
const extractTextFromImage = require('../config/tesseractConfig');


// post routes for the uploading the user report 
router.post('/upload/Report', upload.single('report'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
        // Extract text using Tesseract.js
        const extractedText = await extractTextFromImage(req.file.path);

        res.json({
            success: true,
            message: 'File uploaded and processed successfully',
            file: req.file.path,
            extractedText: extractedText, // Send extracted text in response
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error processing OCR', error: error.message });
    }
});

router.use(upload.handleFileUploadError);
module.exports = router;