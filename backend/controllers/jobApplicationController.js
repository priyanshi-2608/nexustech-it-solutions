const Application = require('../models/jobApplication');
const Job = require("../models/job");
const nodemailer = require('nodemailer');
const { calculateATSScore } = require("../utils/atsMatcher");
const fs = require('fs');

const submitApplication = async (req, res) => {
  try {
    const { jobId, jobTitle, name, email, phone, coverLetter } = req.body;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ success: false, message: 'Resume file is required.' });
    }

    const job = await Job.findById(jobId);
    const jobRequirements = job && Array.isArray(job.requirements) ? job.requirements : [];

    const resumePath = resumeFile.path;
    const atsScore = await calculateATSScore(resumePath, jobRequirements);

    const newApplication = new Application({
      jobId,
      jobTitle: job ? job.title : jobTitle,
      name,
      email,
      phone,
      resumeUrl: resumePath, 
      coverLetter,
      atsScore 
    });
    await newApplication.save();

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
      subject: `New Job Application: ${job ? job.title : jobTitle} - ${name} (ATS: ${atsScore}%)`,
      text: `You received a new job application!\n\nPosition: ${job ? job.title : jobTitle}\nCandidate Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nATS Match Score: ${atsScore}%\n\nCover Letter / Note:\n${coverLetter || 'None provided'}`,
      attachments: [
        {
          filename: resumeFile.originalname,
          path: resumeFile.path
        }
      ]
    };

    const applicantMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Application Received: ${job ? job.title : jobTitle} at NexusTech`,
      text: `Hi ${name},\n\nThank you for applying for the ${job ? job.title : jobTitle} position! We have safely received your application and resume.\n\nOur hiring team is reviewing your profile and will get in touch with you if your qualifications match our requirements.\n\nBest regards,\nNexusTech Talent Team`
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(applicantMailOptions);

    res.status(201).json({ 
      success: true, 
      message: 'Application submitted successfully!', 
      atsScore 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ success: false, message: 'Server error while submitting application.' });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const { jobId } = req.query;
    let query = {};
    if (jobId) {
      query.jobId = jobId;
    }
    const applications = await Application.find(query).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching applications.' });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (application.resumeUrl && fs.existsSync(application.resumeUrl)) {
      fs.unlinkSync(application.resumeUrl);
    }

    await Application.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Application deleted successfully!' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ success: false, message: 'Server error while deleting application.' });
  }
};

module.exports = { submitApplication, getAllApplications, deleteApplication };