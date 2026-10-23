const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, 
  icon: { type: String, required: true },     
  description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('technology', technologySchema);