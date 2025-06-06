const { error } = require("winston");
const logger = require("../utils/logger");
const Post = require("../models/Post");

//create
const createPost = async (req, res) => {
  try {
    const { content, mediaIds } = req.body;
    const newlyCreatedPost = new Post({
      user: req.user.user_id,
      content,
      mediaIds: mediaIds || [],
    });

    await newlyCreatedPost.save();
    logger.info("Post created successfuly", newlyCreatedPost);
    res.status(201).json({
      success: true,
      message: "Post created successfully",
    });
  } catch (err) {
    logger.error("Error creating post", error);
    res.status(500).json({
      success: false,
      message: "Error creating post",
    });
  }
};
//get all
const getAllPosts = async (req, res) => {
  try {
  } catch (err) {
    logger.error("Error fetching posts", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
    });
  }
};
//get by id
const getPost = async (req, res) => {
  try {
  } catch (err) {
    logger.error("Error fetching post", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post by ID",
    });
  }
};
//delete
const deletePost = async (req, res) => {
  try {
  } catch (err) {
    logger.error("Error deleting post", error);
    res.status(500).json({
      success: false,
      message: "Error deleting post",
    });
  }
};
