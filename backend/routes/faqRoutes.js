const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const faqController = require('../controllers/faqController');

router.get('/', faqController.getAllFAQs);

router.post('/',verifyToken, faqController.createFAQ);

router.delete('/:id', verifyToken, faqController.deleteFAQ);

module.exports = router;