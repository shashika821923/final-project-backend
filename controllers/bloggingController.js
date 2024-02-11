const { addNewBlogPost, getAllBlogPosts } = require("../services/bloggingService");

exports.addNewBlog = async (req, res) => {
    var result = await addNewBlogPost(req,res);
    res.send(result);
};

exports.getAllBlogPost = async (req, res) => {
    var result = await getAllBlogPosts(req,res);
    res.send(result);
};

