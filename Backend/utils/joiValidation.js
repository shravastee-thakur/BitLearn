import joi from "joi";

export const registerValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required().trim().messages({
      "string.empty": "Username is required",
    }),
    email: joi.string().email().trim().required().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
    password: joi.string().min(6).max(14).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
    role: joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next();
};

export const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().trim().required().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be valid",
    }),
    password: joi.string().min(6).max(14).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }

  next();
};

export const otpValidation = (req, res, next) => {
  const schema = joi.object({
    userId: joi.string().required().messages({
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
    }),

    otp: joi.string().length(6).required().messages({
      "string.empty": "OTP is required",
      "string.length": "OTP must be exactly 6 digits",
      "any.required": "OTP is required",
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  next();
};
