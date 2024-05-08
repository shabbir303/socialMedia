import express from "express";
import {getFeedPosts, getUserPosts, likePosts} from "../contollers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Read
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

// Update
router.patch("/id/posts", verifyToken, likePosts);

export default router;