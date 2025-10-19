// rateLimiter.ts
import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Initialize rate limiter with a limit of 100 requests per minute per IP
const rateLimiter = new RateLimiterMemory({
  points: 100, // Number of points (requests)
  duration: 60, // Per 60 seconds (1 minute)
});

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.connection.remoteAddress;

  try {
    // Consume 1 point per request for the client IP
    const rateLimiterRes = await rateLimiter.consume(clientIp);

    // Set headers to inform the client about their remaining requests and reset time
    res.setHeader('X-RateLimit-Limit', 100);
    res.setHeader('X-RateLimit-Remaining', rateLimiterRes.remainingPoints);
    res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimiterRes.msBeforeNext / 1000));

    next();
  } catch (error) {
    // If the client exceeds the rate limit, send a 429 Too Many Requests response
    res.status(429).json({
      message: 'Too many requests, please try again later.',
      retryAfter: Math.ceil(error.msBeforeNext / 1000), // Time in seconds before retrying
    });
  }
};
