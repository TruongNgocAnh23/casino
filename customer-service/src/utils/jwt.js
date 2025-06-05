import jwt from "jsonwebtoken";
// import redis from "../config/redis.config.js";
import CustomerRefreshToken from "../models/customer-refresh-token.model.js";

const createAccessToken = async (userId, res) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("customer_access_token", accessToken, {
    httpOnly: true, // prevent XSS
    sameSite: "Strict", // prevent CSRF
    secure: process.env.NODE_ENV === "production",
    maxAge: 1 * 24 * 60 * 60 * 1000
  });
};

const createRefreshToken = async (userId, deviceInfo, res) => {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // await redis.set(`refreshToken: ${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);

  await CustomerRefreshToken.findOneAndDelete({ user_id: userId, device_info: deviceInfo });

  await CustomerRefreshToken.create({
    user_id: userId,
    token: refreshToken,
    device_info: deviceInfo,
    expires_at: expiresAt
  });

  res.cookie("customer_refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export { createAccessToken, createRefreshToken };
