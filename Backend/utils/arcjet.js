import arcjet, { tokenBucket } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    tokenBucket({
      mode: "LIVE", // will block requests
      characteristics: ["ip", "email"],
      refillRate: 5,
      interval: 60, // per minute
      capacity: 20,
    }),
  ],
});

export default aj;
