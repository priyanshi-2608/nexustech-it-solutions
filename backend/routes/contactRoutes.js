const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { submitContactForm, getAllContacts, deleteContact } = require('../controllers/contactController');

router.post('/', submitContactForm);
router.get('/', verifyToken,getAllContacts);         
router.delete('/:id', verifyToken,deleteContact);   

module.exports = router;