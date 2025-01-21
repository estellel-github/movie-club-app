import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  // Set windowMs to 15 minutes
  windowMs: 15 * 60 * 1000,
  // Limit each IP to 5 login requests per windowMs
  max: 5,
  message: {
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
  // Return rate limit info in the `RateLimit-*` headers
  standardHeaders: true,
  // Disable the `X-RateLimit-*` headers
  legacyHeaders: false,
});
