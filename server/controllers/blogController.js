// controllers/blogController.js
import fs from "fs";
import imagekit from "../configs/imageKit.js";
import { format } from "path";
import { Blog } from "../models/Blog.js";
import { Comment } from "../models/Comment.js"; // ✅ FIXED
import main from "../configs/gemini.js";

// ✅ All functions below remain unchanged

export const addBlog = async (req, res) => {
  try {
    console.log("Raw body:", req.body.blog);

    const { title, subtitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const subTitle = subtitle;

    const imageFile = req.file;
    console.log("Received file:", imageFile);

    if (!title) console.log("title is missing");
    if (!subTitle?.trim()) console.log("subtitle is missing");
    if (!description) console.log("description is missing");
    if (!category) console.log("category is missing");
    if (typeof isPublished !== "boolean")
      console.log("isPublished is missing or invalid");

    if (
      !title ||
      !subTitle?.trim() ||
      !description ||
      !category ||
      typeof isPublished !== "boolean"
    ) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // if (!imageFile || !imageFile.path) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Image file missing" });
    // }

    if (!imageFile || !imageFile.buffer) {
      return res
        .status(400)
        .json({ success: false, message: "Image file missing" });
    }

    const fileBuffer = imageFile.buffer;

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs",
    });

    const optimizedImageUrl = imagekit.url({
      // ✅
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280" },
      ],
    });

    const image = optimizedImageUrl;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });

    res.json({ success: true, message: "Blog added successfully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.json({ success: false, message: "Blog not Found" });
    }
    res.json({ success: true, blog });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;

    await Blog.findByIdAndDelete(id);

    //Delete all comments associated with this blog

    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Blog deleted successfyully" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Blog status updated" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });
    res.json({ success: true, message: "Comment added for review" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogId } = req.body;
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt +
        " Generate a blog content for this topic in simple text format and dont't write here is a blog instead direct start writing your blog"
    );

    res.json({ success: true, content });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
