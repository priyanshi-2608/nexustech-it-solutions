const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, required: true }, // Image URL or filename
  bio: { type: String, required: true },
  linkedin: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('teamMember', teamMemberSchema);