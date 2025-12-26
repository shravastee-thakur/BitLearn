import aj from "../utils/arcjet.js";
import logger from "../utils/logger.js";

export const securityMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1,
    });

    if (decision.isDenied() && !decision.reason.isDryRun()) {
      logger.warn(`Security Block: ${decision.reason.type} for IP ${req.ip}`);

      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          success: false,
          message: "Too many attempts. Please try again in a minute.",
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({ message: "No automated access allowed" });
      }

      if (decision.reason.isShield()) {
        return res.status(400).json({ message: "Invalid request parameters" });
      }

      return res.status(403).json({ message: "Forbidden" });
    }

    if (decision.isDenied() && decision.reason.isDryRun()) {
      logger.info(
        `[DRY RUN] Would have blocked ${decision.reason.type} for IP ${req.ip}`
      );
    }

    next();
  } catch (error) {
    logger.error(`Arcjet Error: ${error.message}`);
    next();
  }
};
