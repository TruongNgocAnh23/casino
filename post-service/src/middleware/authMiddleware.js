const logger = require("../utils/logger");

const autheticateRequest = (req, res, next) => {
  const user_id = req.headers["x-user-id"];
  if (!user_id) {
    logger.warn(`Access attemted without user ID`);
    return res.status(401).json({
      success: false,
      message: "Athencation required! Please login to continue",
    });
  }
  req.user = { user_id };
  next();
};

module.exports = { autheticateRequest };
