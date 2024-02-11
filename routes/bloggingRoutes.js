const express = require('express');
const { addNewBlog, getAllBlogPost } = require('../controllers/bloggingController');
const router = express.Router();

router.post('/addBlogPost', addNewBlog);
router.post('/getAllBlogs', getAllBlogPost);

module.exports = router;