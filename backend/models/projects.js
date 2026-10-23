const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, default: 'fullstack' },
  technologies: [{ type: String }],
  imageUrl: { type: String },
  liveUrl: { type: String },
  githubUrl: { type: String },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('projects', projectSchema);