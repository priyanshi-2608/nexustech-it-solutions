const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true }, 
  location: { type: String, required: true },  
  type: { type: String, required: true },       
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],            
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('job', jobSchema);