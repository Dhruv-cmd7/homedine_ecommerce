import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV === 'development';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: () => isDev,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Hardened auth limiter for registration and logins
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 1 minute before trying again.'
  }
});

// Limiter for reset password request actions
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
  message: {
    success: false,
    message: 'Too many password reset requests. Please try again after an hour.'
  }
});
