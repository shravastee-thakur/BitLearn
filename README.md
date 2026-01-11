
<img width="1261" height="595" alt="BitLearn1" src="https://github.com/user-attachments/assets/d0957cb2-8c94-47a9-bb37-6c03c1d9b033" />
<img width="1263" height="597" alt="BitLearn2" src="https://github.com/user-attachments/assets/99be3cd0-9314-4638-8cb9-e40376f63378" />
<img width="1263" height="597" alt="BitLearn3" src="https://github.com/user-attachments/assets/90fb7189-3173-44e6-a9f5-34d3a40d0d48" />


# BitLearn | Secure E-Learning Management System
BitLearn is an E-Learning Management System (LMS) developed to explore the intersection of full-stack development and web security. Rather than just building a functional platform, I used this project as a sandbox to implement "Security-First" principles, focusing on how to protect user data and system integrity in a modern web environment.

## Security & Architecture Focus
This project served as a dive into hardening a Node.js backend. I moved beyond basic logic to implement:

- **Intelligent Shielding:** Integrated Arcjet to experiment with bot detection and proactive rate limiting, moving beyond simple middleware to protect against automated scripts.

- **Authentication Flows:** Implemented a multi-layered approach using Google OAuth 2.0 and JWT stored in secure, httpOnly cookies to practice industry-standard session management.

- **Defensive Coding:** Focused on preventing common vulnerabilities by using JOI for schema validation, mongo-sanitize for NoSQL injection protection, and Helmet for secure header management.

- **Fast Session Handling:** Leveraged Upstash Redis for high-performance OTP storage and tracking, ensuring a smooth 2FA (Two-Factor Authentication) experience.

- **Structured Logging:** Used Winston to create a reliable audit trail for debugging and monitoring system activity.

## Key Features
- Course Lifecycle: Complete management of educational content, including video hosting integration.

- Role-Based Access Control (RBAC): Established clear permission boundaries between Students, Instructors, and Admins to learn granular access management.

- Secure Enrollments: Integrated the Stripe API to handle the flow of digital transactions safely.

- Media Management: Handled optimized image and video processing through Cloudinary and Multer.

## Tech Stack
- **Backend:** Node.js & Express.js (following a modular structure).

- **Database:** MongoDB & Mongoose for flexible data modeling.

- **Caching/Security:** Redis (Upstash) for stateful data and Arcjet for security-as-code.

- **Frontend:** React.js for a responsive, component-based user interface.

- **Utilities:** Passport.js (OAuth), Bcrypt (Password Hashing), and Axios.

### Why I Built This
BitLearn was born out of a curiosity about web security. As a fresher, I wanted to understand not just how to build features, but how to protect them. This project allowed me to practice the "Security-First" mindset, teaching me how to think like a developer while anticipating the challenges of the open web.
