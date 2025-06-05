const express = require("express");
const { createPost } = require("../controllers/post-controller");
const { autheticateRequest } = require("../middleware/authMiddleware");

const router = express();

router.use(autheticateRequest);
router.post("/create-post", createPost);

module.exports = router;
