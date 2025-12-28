import User from "../models/UserModel.js";
import logger from "../utils/logger.js";
import sanitize from "mongo-sanitize";
import { deleteOtp, getOtp, saveOtp } from "../utils/otp.js";
import sendMail from "../config/sendMail.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtToken.js";
import passport from "passport";

export const register = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { name, email, password, role } = sanitizeBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Error in register: ${error.message}`);
    next(error);
  }
};

// login with email/password
export const loginStepOne = async (req, res, next) => {
  try {
    const sanitizeBody = sanitize(req.body);
    const { email, password } = sanitizeBody;

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

    const storedOtp = await getOtp(user.email);

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
      .status(201)
      .cookie("refreshToken", newrefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Logged in successfully",
        accessToken: newaccessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.isVerified,
        },
      });
  } catch (error) {
    logger.error(`Error in verify otp: ${error.message}`);
    next(error);
  }
};

// login with Google OAuth
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    if (!user.isVerified) {
      user.isVerified = true;
    }
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      // maxAge: 15 * 60 * 1000,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}/courses`);
  } catch (error) {
    logger.error(`Google callback error: ${error.message}`);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
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

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findOne({ _id: decoded.id, refreshToken });

    if (!user) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const newaccessToken = generateAccessToken(user);
    const newrefreshToken = generateRefreshToken(user);

    user.refreshToken = newrefreshToken;
    await user.save();

    return res
      .status(201)
      .cookie("refreshToken", newrefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        accessToken: newaccessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          verified: user.isVerified,
        },
      });
  } catch (error) {
    logger.error(`Error during refresh handler : ${error.message}`);
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

    const { confirmationText } = req.body;

    if (confirmationText !== "DELETE") {
      return res.status(400).json({
        success: false,
        message: "Please type 'DELETE' to confirm account deletion.",
      });
    }

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
    logger.error(`Error in deleteUser handler: ${error.message}`);
    next(error);
  }
};
