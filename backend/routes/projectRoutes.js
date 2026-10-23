const express = require('express');
const router = express.Router();
const { 
  getProjects,
  getProjectById, 
  createProject, 
  deleteProject 
} = require('../controllers/projectController');
const verifyToken = require('../middleware/auth');

router.get("/",getProjects);
router.get("/:id",getProjectById);
router.post("/",verifyToken,createProject);
router.delete("/:id",verifyToken,deleteProject);

module.exports = router;