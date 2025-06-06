const logger = require("../utils/logger");
const { validateRegistration, validateLogin } = require("../utils/validation");
const User = require("../models/User");
const generateTokens = require("../utils/generateToken");
const RefreshToken = require("../models/RefreshToken");

//register
const registerUser = async (req, res) => {
  logger.info("Resgistration endpoint hit...");
  try {
    const { error } = validateRegistration(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      logger.warn("Email already exists");
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    user = new User({ email, password });
    await user.save();
    logger.info("User saved successfully", user._id);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    logger.error("Registration error occured", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Login
const loginUser = async (req, res) => {
  logger.info("Login end point hit...");
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      logger.warn("Invalid user");
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn("Invalid password");
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    const { accessToken, refreshToken } = await generateTokens(user);
    return res.status(201).json({
      success: true,
      accesstoken: accessToken,
      refreshtoken: refreshToken,
      user_id: user._id,
    });
  } catch (err) {
    logger.error("Login error occured", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Refresh token
const refreshTokenUser = async (req, res) => {
  logger.info("Refresh token endpoint hit...");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh token misssing");
      return res.status(400).json({
        success: false,
        message: "Refresh token misssing",
      });
    }
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken || storedToken < new Date()) {
      logger.info("Invalid or expired refresh token");
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }
    const user = await User.findById(storedToken.user);
    if (!user) {
      logger.warn("User not found");
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(user);
    await RefreshToken.deleteOne({ _id: storedToken._id });
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    logger.error("Refresh token error occured", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//logout
const logoutUser = async (req, res) => {
  logger.info("Logout endpoint hit...");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn("Refresh token misssing");
      return res.status(400).json({
        success: false,
        message: "Refresh token misssing",
      });
    }
    await RefreshToken.deleteOne({ token: refreshToken });
    logger.info("Refresh token deleted for logout");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    logger.error("Error while logging out", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = { registerUser, loginUser, refreshTokenUser, logoutUser };
