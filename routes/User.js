const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

// Controller functions
const { signup, login } = require("../controllers/authController");

const {
  getUserInfo,
  updateUser,
  changePassword,
  uploadPhoto,
  getUserByToken,
} = require("../controllers/userController");
const {
  createPost,
  editPost,
  deletePost,
  getUserPosts,
  getAllPosts,
} = require("../controllers/postController");
const authenticateToken = require("../middleware/authenticateToken");
const { sendContactEmail } = require("../controllers/contactController");
const validateContactForm = require("../middleware/validateContactForm");
const { getNotifications, markAsRead } = require('../controllers/notificationController');

// Authentication routes
router.post("/login", login);
router.post("/signup", signup);

// User routes
router.get("/user/info", authenticateToken, getUserInfo);
router.put("/user/update", authenticateToken, updateUser);
router.put("/user/password", authenticateToken, changePassword);
router.put("/user/photo", authenticateToken, uploadPhoto);
router.get("/user/profile/:token", getUserByToken);

// Post routes
router.post("/posts", authenticateToken, createPost);
router.put("/posts/:id", authenticateToken, editPost);
router.delete("/posts/:id", authenticateToken, deletePost);
router.get("/posts/user", authenticateToken, getUserPosts);

// New route to get all posts
router.get("/posts", getAllPosts);
router.post("/contact", validateContactForm, sendContactEmail);

router.get('/notifications/:token', authenticateToken, getNotifications);
router.patch('/notifications/:token/:notificationId', authenticateToken, markAsRead);

module.exports = router;
