const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { 
  getTeamMembers, 
  getTeamMemberById,
  createTeamMember, 
  deleteTeamMember 
} = require('../controllers/teamMemberController');

router.get("/",getTeamMembers);
router.get("/:id",getTeamMemberById);
router.post("/",verifyToken,createTeamMember);
router.delete("/:id",verifyToken,deleteTeamMember);

module.exports = router;