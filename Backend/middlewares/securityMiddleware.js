import aj from "../utils/arcjet.js";
import logger from "../utils/logger.js";

export const securityMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      email: req.body?.email || "",
      requested: 1,
    });

    if (decision.isDenied()) {
      logger.warn(`Security Block: ${decision.reason.type} for IP ${req.ip}`);

      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Too many requests. Slow down!" });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({ message: "No automated access allowed" });
      }

      if (decision.reason.isShield()) {
        return res.status(400).json({ message: "Invalid request parameters" });
      }

      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch (error) {
    logger.error(`Arcjet Error: ${error.message}`);
    next();
  }
};
