const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/auth");
const { getAllBlogs,
        getBlogById,
        createBlog, 
        deleteBlog } = require('../controllers/blogController');

router.get('/', getAllBlogs);
router.get('/:id',getBlogById);
router.post('/', verifyToken,createBlog);
router.delete('/:id',verifyToken, deleteBlog);

module.exports = router;