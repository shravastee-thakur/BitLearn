import express from "express";
import {
  deleteUser,
  googleAuth,
  googleCallback,
  loginStepOne,
  logout,
  refreshHandler,
  register,
  verifyOtp,
} from "../controllers/UserController.js";
import {
  loginValidation,
  otpValidation,
  registerValidation,
} from "../utils/joiValidation.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import passport from "passport";
import { securityMiddleware } from "../middlewares/securityMiddleware.js";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/loginStepOne", securityMiddleware, loginValidation, loginStepOne);
router.post("/verifyOtp", securityMiddleware, otpValidation, verifyOtp);
router.post("/refreshHandler", refreshHandler);

// Redirect to Google login
router.get("/google", googleAuth);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

router.post("/logout", authenticate, logout);
router.post("/deleteUser", authenticate, deleteUser);

export default router;
