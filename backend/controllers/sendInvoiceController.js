const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const PhysicalTicket = require('../models/PhysicalTicket');
const Doctor = require('../models/Doctor');
const DoctorDetail = require('../models/DoctorDetail');
const Patient = require('../models/Patient');

exports.sendInvoice = async (appointment) => {
    try {
        // Check if ticket already exists
        const existingTicket = await PhysicalTicket.findOne({ where: { appointmentId: appointment.id } });
        if (existingTicket) {
            console.log(`Ticket already exists for appointment ${appointment.id}`);
            return existingTicket;
        }

        // Generate a random 8-character token number
        const tokenNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

        // Fetch doctor and patient details
        const doctor = await Doctor.findByPk(appointment.doctorId);
        const doctorDetail = await DoctorDetail.findOne({ where: { doctorId: appointment.doctorId } });
        const patient = await Patient.findByPk(appointment.patientId);

        const dir = path.join(__dirname, '../public/tickets');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        // Define PDF path
        const pdfPath = path.join(dir, `${tokenNumber}.pdf`);

        // Generate PDF
        const doc = new PDFDocument({ margin: 50 });
        doc.pipe(fs.createWriteStream(pdfPath));

        // Title
        doc.fontSize(20).text(`Appointment Invoice`, { align: 'center' });
        doc.moveDown(2);

        // Patient and Token Details
        doc.fontSize(14).text(`Token Number: ${tokenNumber}`, { align: 'left' });
        doc.text(`Patient Name: ${patient.firstName || ''} ${patient.lastName || ''}`);
        doc.text(`Phone: ${patient.phone || 'N/A'}`);
        doc.moveDown();

        // Appointment Details
        doc.fontSize(14).text(`Appointment Date: ${appointment.date}`);
        doc.text(`Start Time: ${appointment.StartTime}`);
        doc.text(`End Time: ${appointment.EndTime}`);
        doc.moveDown();

        // Doctor Details in a Table-Like Format
        doc.fontSize(16).text(`Doctor Details`, { underline: true });
        doc.moveDown();
        doc.fontSize(12);
        doc.text(`Name: ${doctor.firstName} ${doctor.lastName}`);
        doc.text(`Specialty: ${doctorDetail.speciality || 'N/A'}`);
        doc.text(`Experience: ${doctorDetail.experience || 0} years`);
        doc.text(`Consultation Fee: $${doctorDetail.consultationFee || 'N/A'}`);
        doc.text(`Hospital Affiliation: ${doctorDetail.hospitalAffiliation || 'N/A'}`);
        doc.text(`Address: ${doctorDetail.address || 'N/A'}, ${doctorDetail.city || ''}, ${doctorDetail.state || ''}, ${doctorDetail.zipCode || ''}, ${doctorDetail.country || ''}`);
        doc.moveDown();

        // Footer
        doc.fontSize(10).text(`This is a system-generated invoice. No signature required.`, { align: 'center' });
        doc.end();

        // Save ticket in DB
        const newTicket = await PhysicalTicket.create({
            appointmentId: appointment.id,
            tokenNumber,
            pdfLink: `/public/tickets/${tokenNumber}.pdf`,
        });

        console.log(`Invoice generated and sent for appointment ${appointment.id}`);
        return newTicket;
    } catch (error) {
        console.error("Error generating and sending invoice:", error);
        throw error;
    }
};
