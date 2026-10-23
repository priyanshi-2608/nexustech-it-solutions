const router = require('express').Router();
const { loginAdmin } = require('../controllers/adminController');

router.post('/login', loginAdmin);

module.exports = router;