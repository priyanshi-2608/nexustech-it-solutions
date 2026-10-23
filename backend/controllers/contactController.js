const Contact = require('../models/contact');
const nodemailer = require('nodemailer');

const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${subject}`,
      text: `You received a new message from:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `We've received your message! - NexusTech`,
      text: `Hi ${name},\n\nThank you for reaching out to NexusTech! We have received your message regarding "${subject}" and our team will get back to you within 24–48 hours.\n\nBest regards,\nNexusTech Team`
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(201).json({ success: true, message: 'Message sent and saved successfully!' });
  } catch (error) {
    console.error('Error handling contact submission:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); 
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

module.exports = {
  submitContactForm,
  getAllContacts,
  deleteContact
};