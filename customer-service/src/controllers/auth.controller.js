import jwt from "jsonwebtoken";
import CustomerRefreshToken from "../models/customer-refresh-token.model.js";
import Customer from "../models/customer.model.js";
import { hashPassword, verifyPassword } from "../utils/helper.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";
import { loginValidation, registerValidation } from "../validations/customer.validation.js";

// Hàm đăng ký tài khoản customer
const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone, citizen_id, tax_id, birthday, address } = req.body;

    const { error } = registerValidation.validate(req.body, { abortEarly: true });

    if (error) {
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const currentUser  = await Customer.findOne({ email: email });

    if (currentUser) {
      return res.status(400).json({ error: true, message: `Email ${email} already exists.` });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new Customer({
      first_name: first_name,
      last_name: last_name || null,
      email: email,
      password: hashedPassword,
      phone: phone || null,
      citizen_id: citizen_id,
      tax_id: tax_id,
      birthday: birthday || null,
      address: address || null
    });

    await newUser.save();
    res.status(201).json({ error: false, message: "Registered successfully." });
  } catch (error) {
    error.methodName = register.name;
    next(error);
  }
};


// Hàm đăng nhập tài khoản customer
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = loginValidation.validate(req.body, { abortEarly: true });
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (error) {
      return res.status(400).json({ error: true, message: error.details[0].message });
    }

    const currentUser  = await Customer.findOne({ email: email });

    if (!currentUser) {
      return res.status(404).json({ error: true, message: `Email ${email} not found.` });
    }

    const isCorrectPassword = await verifyPassword(currentUser.password, password);

    if (!isCorrectPassword) {
      return res.status(400).json({ error: true, message: "Password not correct." });
    }

    await createAccessToken(currentUser._id, res);
    await createRefreshToken(currentUser._id, userAgent, res);

    res.status(200).json({
      error: false,
      message: "Logged in successfully.",
      data: {
        name: [currentUser.first_name, currentUser.last_name].filter(Boolean).join(' '),
        email: currentUser.email
      }
    });
  } catch (error) {
    error.methodName = login.name;
    next(error);
  }
};

// Hàm đăng xuất tài khoản customer
const logout = async (req, res, next) => {
  try {
    const refreshTokenFromCookie = req.cookies.customer_refresh_token;

    if (refreshTokenFromCookie) {
      const decoded = jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET);
      const userId = decoded.userId;
      const userAgent = req.headers['user-agent']?.substring(0, 100) || 'unknown';

      await CustomerRefreshToken.findOneAndDelete({ user_id: userId, device_info: userAgent });
    }

    res.clearCookie("customer_access_token");
    res.clearCookie("customer_refresh_token");

    res.status(200).json({ error: false, message: "Logged out successfully." });
  } catch (error) {
    error.methodName = logout.name;
    next(error);
  }
};

// Hàm refresh token tài khoản customer
const refreshToken = async (req, res, next) => {
  try {
    const refreshTokenFromCookie = req.cookies.customer_refresh_token;

    if (!refreshTokenFromCookie) {
      return res.status(401).json({ error: true, message: "No refresh token provided." });
    }

    const savedToken = await CustomerRefreshToken.findOne({ token: refreshTokenFromCookie });

    if (!savedToken) {
      return res.status(403).json({ error: true, message: "Refresh token not recognized in database." });
    }

    if (new Date() > savedToken.expires_at) {
      await CustomerRefreshToken.findOneAndDelete({ token: refreshTokenFromCookie });
      return res.status(403).json({ error: true, message: "Refresh token expired." });
    }

    const decoded = jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET);

    await createAccessToken(decoded.userId, res);

    res.status(200).json({ error: false, message: "Token refreshed successfully." });
  } catch (error) {
    error.methodName = refreshToken.name;
    next(error);
  }
};

// Hàm lấy thông tin customer đã đăng nhập
const getAuthCustomer = async (req, res, next) => {
  try {
    res.status(200).json({ error: false, data: req.user });
  } catch (error) {
    error.methodName = getAuthCustomer.name;
    next(error);
  }
};

export { register, login, logout, refreshToken, getAuthCustomer };
