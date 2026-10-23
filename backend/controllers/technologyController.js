const Technology = require('../models/technology');

const getTechnologies = async (req, res) => {
  try {
    const technologies = await Technology.find();
    res.json(technologies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTechnology = async (req, res) => {
  try {
    const { name, category, icon, description } = req.body;
    
    const newTechnology = new Technology({
      name,
      category,
      icon,
      description
    });

    const savedTechnology = await newTechnology.save();
    res.status(201).json(savedTechnology);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteTechnology = async (req, res) => {
  try {
    const technology = await Technology.findById(req.params.id);
    
    if (!technology) {
      return res.status(404).json({ message: 'Technology not found' });
    }

    await technology.deleteOne();
    res.json({ message: 'Technology removed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTechnologies,
  createTechnology,
  deleteTechnology,
};