import express from "express";
import { getAuthCustomer, login, logout, refreshToken, register } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post("/refresh-token", refreshToken);

router.get("/get-auth-customer", protectRoute, getAuthCustomer);

export default router;