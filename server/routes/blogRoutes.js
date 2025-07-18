// routes/blogRouter.js
import express from "express";
import {
  addBlog,
  addComment,
  deleteBlogById,
  getAllBlogs,
  getBlogById,
  getBlogComments,
  togglePublish,
  generateContent,
} from "../controllers/blogController.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("file"), auth, addBlog); // ✅ changed from "image" to "file"
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:blogId", getBlogById);
blogRouter.post("/delete", auth, deleteBlogById);
blogRouter.post("/toggle-publish", auth, togglePublish);
blogRouter.post("/add-comment", addComment); // ✅ added missing slash
blogRouter.post("/comments", getBlogComments); // ✅ added missing slash

blogRouter.post("/generate", auth, generateContent);

export default blogRouter;
