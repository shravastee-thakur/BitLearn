
<img width="1261" height="595" alt="BitLearn1" src="https://github.com/user-attachments/assets/d0957cb2-8c94-47a9-bb37-6c03c1d9b033" />
<img width="1263" height="597" alt="BitLearn2" src="https://github.com/user-attachments/assets/99be3cd0-9314-4638-8cb9-e40376f63378" />
<img width="1263" height="597" alt="BitLearn3" src="https://github.com/user-attachments/assets/90fb7189-3173-44e6-a9f5-34d3a40d0d48" />


# BitLearn | Secure E-Learning Management System
BitLearn is a production-grade Learning Management System (LMS) built with the MERN stack. Designed with a "Security-First" philosophy, it integrates advanced bot protection, rate limiting, and robust authentication flows to simulate a real-world enterprise environment.

Developed during the 2025 semester break as a capstone project in full-stack engineering and web security.

## Security & Architecture Highlights
This project goes beyond basic CRUD operations by implementing a hardened backend architecture:

- **Advanced Shielding**: Utilizes Arcjet for intelligent rate limiting and bot protection to prevent automated attacks.

- **Encrypted Authentication**: Multi-layered auth using Google OAuth 2.0 and JWT stored in secure, httpOnly cookies.

- **Data Integrity**: Input validation via JOI, protection against NoSQL injection with mongo-sanitize, and specialized security headers using Helmet.

- **Session Management**: High-performance OTP storage and session handling using Upstash Redis.

- **Logging**: Comprehensive system activity and error tracking with Winston.

## Key Features
- Course Management: Full lifecycle for courses including video content hosting.

- Secure Payments: Integrated Stripe API for handling enrollments and financial transactions.

- RBAC (Role-Based Access Control): Granular permissions for Students, Instructors, and Admins.

- 2FA (Two-Factor Authentication): Enhanced account security via Redis-backed OTP verification.

- Media Handling: Optimized image and video uploads managed via Cloudinary.

## Tech Stack
### Backend
- Node.js & Express.js: Core server framework (v5.x).

- MongoDB & Mongoose: NoSQL database with schema modeling.

- Redis (Upstash): Serverless caching for OTPs and rate-limit tracking.

- Arcjet: Security-as-code for bot detection and rate limiting.

### Frontend (Integrated)
- React.js: Component-based UI logic.

- Axios: Promise-based HTTP client for API communication.

### DevOps & Utilities
- Cloudinary: Cloud-based media management.

- Passport.js: Authentication middleware for Google OAuth strategy.

- Bcrypt: Password hashing with salted rounds.

- Multer: Multipart/form-data handling for file uploads.
