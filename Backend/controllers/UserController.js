import User from "../models/UserModel.js";
import logger from "../utils/logger.js";
import sanitize from "mongo-sanitize";
import aj from "../utils/arcjet.js";
import { deleteOtp, getOtp, saveOtp } from "../utils/otp.js";
import sendMail from "../config/sendMail.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtToken.js";

export const register = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { name, email, password } = sanitizeBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error(`Error in register: ${error.message}`);
    next(error);
  }
};

export const loginStepOne = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { email, password } = sanitizeBody;

    // rate limit
    const decision = await aj.protect(req, { email });
    if (decision.isDenied()) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Try again later.",
      });
    }

    const user = await User.loginWithEmail(email, password);

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await saveOtp(email, otp);

    const htmlContent = `
            <p>Login Verification</p>
            <p style="color: red;">Your OTP for login is:</p>
            <h2><strong>${otp}</strong></h2>
            <p>This OTP will expire in 5 minutes.</p>
          `;

    await sendMail(user.email, "Your 2FA Login OTP", htmlContent);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify.",
      userId: user._id,
    });
  } catch (error) {
    logger.error(`Error in login step one: ${error.message}`);
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { userId, otp } = sanitizeBody;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or OTP",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const storedOtp = await getOtp(email);

    if (!storedOtp || String(storedOtp) !== otp) {
      const message = !storedOtp
        ? "OTP expired or invalid"
        : "Invalid OTP. Try again.";
      return res.status(400).json({ success: false, message });
    }

    await deleteOtp(user.email);
    if (!user.isVerified) {
      user.isVerified = true;
    }

    const newaccessToken = generateAccessToken(user);
    const newrefreshToken = generateRefreshToken(user);

    user.refreshToken = newrefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("refreshToken", newrefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "OTP sent to your email. Please verify.",
        accessToken: newaccessToken,
        userId: user._id,
      });
  } catch (error) {
    logger.error(`Error in verify otp: ${error.message}`);
    next(error);
  }
};

export const refreshHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: Invalid Token" });
    }

    const decoded = verifyRefreshToken({ refreshToken });

    const user = await User.findOne({ _id: decoded.id, refreshToken });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newaccessToken = generateAccessToken(user);
    const newrefreshToken = generateRefreshToken(user);

    user.refreshToken = newrefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("refreshToken", newrefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "OTP sent to your email. Please verify.",
        accessToken: newaccessToken,
        userId: user._id,
      });
  } catch (error) {
    logger.error(`Error in refresh handler: ${error.message}`);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);

    const user = await User.findOne({ refreshToken: token });

    if (user) {
      (user.refreshToken = ""), (user.isVerified = false), await user.save();
    }

    return res
      .status(200)
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    logger.error(`Error in refresh handler: ${error.message}`);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    return res
      .status(200)
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "Your account has been deleted successfully.",
      });
  } catch (error) {
    logger.error(`Error in refresh handler: ${error.message}`);
    next(error);
  }
};
