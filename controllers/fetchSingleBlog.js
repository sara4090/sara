const Blog = require('../models/Blog')
const fetchSingleBlog = async (req, res) => {
    const blogId = req.params.id;
    try {
        const blogs = await Blog.findById({ _id: blogId });
        res.status(200).send({ blogs })

    } catch (error) {
        console.log(error)
        res.status(400).send({ error: error.message })
    }
}

module.exports = { fetchSingleBlog };