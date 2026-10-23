const express = require('express');
const {
  getFeaturedTestimonials,
  submitClientFeedback,
  createAdminTestimonial,
  getAllTestimonialsAdmin,
  toggleTestimonialStatus,
  deleteTestimonial,
} = require('../controllers/testimonialController.js');

const verifyToken = require('../middleware/auth.js');

const router = express.Router();

router.get('/', getFeaturedTestimonials);

router.post('/submit', submitClientFeedback);

router.get('/admin/all', verifyToken, getAllTestimonialsAdmin);
router.post('/admin/create', verifyToken, createAdminTestimonial);
router.patch('/admin/:id/toggle', verifyToken, toggleTestimonialStatus);
router.delete('/admin/:id', verifyToken, deleteTestimonial);

module.exports = router;