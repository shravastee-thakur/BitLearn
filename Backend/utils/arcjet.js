import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import dotenv from "dotenv";
dotenv.config();

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN",
      // Block all bots except
      allow: ["CATEGORY:SEARCH_ENGINE", "HTTP_CLIENT:POSTMAN"],
    }),

    tokenBucket({
      mode: "LIVE", // will block requests
      name: "authLimit",
      characteristics: ["ip.src"],
      refillRate: 5,
      interval: 60, // per minute
      capacity: 20,
    }),
  ],
});

export default aj;
