const Blog = require('../models/Blog')

const deleteBlog = async (req, res) => {
    const blogId = req.params.id;
    
    
    try {
        const blog = await Blog.findById(blogId);
      
        if (!blog) {
            return res.status(404).json({ message: "No blog found" })
        }

        const deletedBlog = await Blog.findByIdAndDelete({ _id: blogId })
        res.status(200).send({ message: "Blog deleted successfully", deletedBlog })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = { deleteBlog };