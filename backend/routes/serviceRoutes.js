const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { 
  getServices, 
  getServiceById,
  createService, 
  deleteService 
} = require('../controllers/serviceController');

router.get("/",getServices);
router.get("/:id",getServiceById);
router.post("/",verifyToken,createService);
router.delete("/:id",verifyToken,deleteService);

module.exports = router;