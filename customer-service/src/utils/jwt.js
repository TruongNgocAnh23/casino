import jwt from "jsonwebtoken";
import redis from "../config/redis.config.js";

const createTokens = async (res, userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // await redis.set(`refreshToken: ${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);

  res.cookie("customer-access-token", accessToken, {
    httpOnly: true, // prevent XSS
    sameSite: "Strict", // prevent CSRF
    secure: process.env.NODE_ENV === "production",
    maxAge: 1 * 24 * 60 * 60 * 1000
  });

  res.cookie("customer-refresh-token", refreshToken, {
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export { createTokens };
