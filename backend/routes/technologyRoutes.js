const express = require('express');
const router = express.Router();
const { 
  getTechnologies, 
  createTechnology,
  deleteTechnology
} = require('../controllers/technologyController');

const verifyToken = require("../middleware/auth");

router.get("/",getTechnologies);
router.post("/",verifyToken,createTechnology);
router.delete("/:id",verifyToken,deleteTechnology)

module.exports = router;