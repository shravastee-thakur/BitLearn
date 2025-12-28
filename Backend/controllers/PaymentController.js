import Payment from "../models/PaymentModel.js";
import Course from "../models/CourseModel.js";
import User from "../models/UserModel.js";
import Stripe from "stripe";
import logger from "../utils/logger.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripePayment = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!courseId) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const user = await User.findById(userId);
    if (user.subscription.includes(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "You already own this course" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.title,
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { courseId: courseId.toString(), userId: userId.toString() },
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-failure`,
    });

    await Payment.create({
      user: userId,
      course: courseId,
      stripeSessionId: session.id,
      amount: course.price,
      status: "pending",
    });

    return res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    logger.error(`Error in stripe payment: ${error.message}`);
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { sessionId, courseId } = req.body;
    const userId = req.user.id;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not verified" });
    }

    const paymentRecord = await Payment.findOne({ stripeSessionId: sessionId });

    if (paymentRecord?.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment already processed or invalid",
      });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user.subscription.includes(courseId)) {
      user.subscription.push(courseId);
      await user.save();
    }

    paymentRecord.status = "completed";
    await paymentRecord.save();

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #476EAE;">Course Purchase Confirmation</h2>
    <p>Dear ${user.name},</p>
    <p>Thank you for enrolling in <strong>
    ${course.title}
      </strong>! Your payment was successful, and the course has been added to your library.</p>
    
    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px;">
      <h3 style="margin-top: 0;">Enrollment Details:</h3>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Course Name:</strong> ${course.title}</li>
        <li><strong>Price Paid:</strong> ₹${course.price.toLocaleString()}</li>
        <li><strong>Purchase Date:</strong> ${new Date().toLocaleDateString(
          "en-GB"
        )}</li>
        <li><strong>Access Type:</strong> Lifetime Access</li>
      </ul>
    </div>

    <p style="margin-top: 20px;">
      <a href="${process.env.FRONTEND_URL}/course/${course._id}" 
         style="background-color: #476EAE; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
         Start Learning Now
      </a>
    </p>

    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>Happy Learning!<br>The LMS Team</p>
  </div>
`;

    await sendMail(user.email, "Course Subscription Details", htmlContent);

    res.status(200).json({
      success: true,
      message: "Course added to your library",
    });
  } catch (error) {
    logger.error(`Error in verify payment: ${error.message}`);
    next(error);
  }
};
