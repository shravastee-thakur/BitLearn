import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import {
  stripePayment,
  verifyPayment,
} from "../controllers/PaymentController.js";

const router = express.Router();

router.post("/stripePayment", authenticate, stripePayment);
router.post("/verifyPayment", authenticate, verifyPayment);

export default router;
