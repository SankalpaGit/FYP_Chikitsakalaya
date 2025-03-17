// routes/blogRoutes.js

const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const upload = require("../config/multer");

// Create Blog (Admin Only)
router.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { title, content, isPublished } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newBlog = await Blog.create({
      title,
      content,
      imageUrl,
      isPublished: isPublished !== undefined ? isPublished : true, // Default true
    });

    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: "Error creating blog" });
  }
});

// Get All Published Blogs (Public View)
router.get("/view", async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { isPublished: true }, // Only show published blogs
    });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Error fetching blogs" });
  }
});

// Get Blog by ID (Public View)
router.get("/view/:blogID", async (req, res) => {
  try {
    const { blogID } = req.params;
    const blog = await Blog.findOne({ where: { id: blogID, isPublished: true } });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Error fetching blog" });
  }
});

// Toggle Blog Publish Status (Admin Only)
router.put("/toggle-publish/:blogID", async (req, res) => {
  try {
    const { blogID } = req.params;
    const blog = await Blog.findByPk(blogID);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.isPublished = !blog.isPublished; // Toggle the publish status
    await blog.save();

    res.status(200).json({ message: "Blog publish status updated", blog });
  } catch (error) {
    res.status(500).json({ error: "Error updating publish status" });
  }
});

router.get("/view-all", async (req, res) => {
    try {
      const blogs = await Blog.findAll(); // No filter, show all blogs
      res.status(200).json(blogs);
    } catch (error) {
      res.status(500).json({ error: "Error fetching blogs" });
    }
  });

module.exports = router;
