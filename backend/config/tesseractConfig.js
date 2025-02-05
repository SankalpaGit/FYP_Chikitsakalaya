// config/tesseractConfig.js

const Tesseract = require('tesseract.js'); //importing the tesseract

const extractTextFromImage = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: (m) => console.log(m), // Logs OCR progress
    });

    return processExtractedText(text); // Process extracted text
  } catch (error) {
    console.error('Error extracting text:', error);
    throw new Error('Failed to process image with OCR');
  }
};

// Function to process extracted text
const processExtractedText = (text) => {
  const data = {
    personal: {}
  };

  // Extract Personal Info
  const fullNameMatch = text.match(/Name:\s*(.+)/i);
  const dobMatch = text.match(/DOB:\s*(.+)/i);
  const genderMatch = text.match(/Gender:\s*(Male|Female|Other)/i);
  const phoneMatch = text.match(/\b\d{10}\b/);
  const addressMatch = text.match(/Address:\s*(.+)/i);

  // Split full name into first and last name
  if (fullNameMatch) {
    const nameParts = fullNameMatch[1].trim().split(/\s+/); // Split by space
    data.personal.firstName = nameParts[0] || null;
    data.personal.lastName = nameParts.slice(1).join(' ') || null;
  }

  // checking if data title matches else null
  data.personal.dob = dobMatch ? dobMatch[1].trim() : null; 
  data.personal.gender = genderMatch ? genderMatch[1].trim() : null;
  data.personal.phone = phoneMatch ? phoneMatch[0] : null;
  data.personal.address = addressMatch ? addressMatch[1].trim() : null;

  return data;
};

module.exports = extractTextFromImage;