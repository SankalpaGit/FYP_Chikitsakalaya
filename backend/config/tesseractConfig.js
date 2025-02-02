// config/tesseractConfig.js

const Tesseract = require('tesseract.js');

const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: (m) => console.log(m), // Logs OCR progress in console
    });

    console.log('Extracted Text:', text); // Log extracted text for debugging
    return text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to process image with OCR');
  }
};

module.exports = extractTextFromImage;
