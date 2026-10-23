const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/auth');
const { submitApplication, getAllApplications, deleteApplication} = require('../controllers/jobApplicationController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('resume'),submitApplication);
router.get("/",verifyToken,getAllApplications);
router.delete("/:id",verifyToken,deleteApplication);

module.exports = router;