const Testimonial = require('../models/testimonial');

const getFeaturedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isFeatured: true }).sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
};

const submitClientFeedback = async (req, res) => {
  try {
    const { clientName, role, quote, rating } = req.body;

    if (!clientName || !role || !quote) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const initials = clientName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    const newTestimonial = new Testimonial({
      clientName,
      role,
      quote,
      rating: rating || 5,
      initials,
      isFeatured: false, 
    });

    await newTestimonial.save();
    res.status(201).json({ message: 'Feedback submitted successfully! Thank you.' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error: error.message });
  }
};

const createAdminTestimonial = async (req, res) => {
  try {
    const { clientName, role, quote, rating, isFeatured } = req.body;

    if (!clientName || !role || !quote) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const initials = clientName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    const testimonial = new Testimonial({
      clientName,
      role,
      quote,
      rating: rating || 5,
      initials,
      isFeatured: isFeatured !== undefined ? isFeatured : true,
    });

    const savedTestimonial = await testimonial.save();
    res.status(201).json(savedTestimonial);
  } catch (error) {
    res.status(500).json({ message: 'Error creating testimonial', error: error.message });
  }
};

const getAllTestimonialsAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all testimonials', error: error.message });
  }
};

const toggleTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    testimonial.isFeatured = !testimonial.isFeatured;
    await testimonial.save();

    res.status(200).json({ message: 'Testimonial status updated successfully!', testimonial });
  } catch (error) {
    res.status(500).json({ message: 'Error updating testimonial status', error: error.message });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Testimonial.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    res.status(200).json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error: error.message });
  }
};

module.exports = {
  getFeaturedTestimonials,
  submitClientFeedback,
  createAdminTestimonial,
  getAllTestimonialsAdmin,
  toggleTestimonialStatus,
  deleteTestimonial,
};