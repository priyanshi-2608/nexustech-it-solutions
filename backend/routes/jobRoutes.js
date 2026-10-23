const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { getJobs,
        getJobById,
        createJob, 
        deleteJob } = require('../controllers/jobController');

router.get("/",getJobs);
router.get("/:id",getJobById);
router.post("/",verifyToken,createJob);
router.delete('/:id',verifyToken,deleteJob);

module.exports = router;