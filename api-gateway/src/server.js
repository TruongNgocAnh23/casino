require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Redis = require("ioredis");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const logger = require("../src/utils/logger");
const proxy = require("express-http-proxy");
const errHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = new Redis(process.env.REDIS_URL);

// Security & middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        success: false,
        message: "Too many requests",
      });
    },
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    }),
  })
);

// Log all requests
app.use((req, res, next) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  logger.info(`Body: ${JSON.stringify(req.body)}`);
  next();
});

// Shared proxy options factory
const createProxyOptions = (serviceName) => ({
  proxyReqPathResolver: (req) => req.originalUrl.replace(/^\/v1/, "/api"),
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy error (${serviceName}): ${err.message}`);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  },
  proxyReqOptDecorator: (proxyReqOpts) => {
    proxyReqOpts.headers["Content-Type"] = "application/json";
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData) => {
    logger.info(`Response from ${serviceName}: ${proxyRes.statusCode}`);
    return proxyResData;
  },
});

// Proxy: Identity Service
app.use(
  "/v1/auth",
  proxy(process.env.IDENTITY_SERVICE_URL, {
    ...createProxyOptions("identity-service"),
    proxyReqPathResolver: (req) =>
      req.originalUrl.replace(/^\/v1\/auth/, "/api"),
  })
);

// Proxy: Customer Service
app.use(
  "/v1/customers",
  proxy(process.env.CUSTOMER_SERVICE_URL, {
    ...createProxyOptions("customer-service"),
    proxyReqPathResolver: (req) =>
      req.originalUrl.replace(/^\/v1\/customers/, "/api"),
  })
);

// Error handler
app.use(errHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`API Gateway is running on port: ${PORT}`);
  logger.info(`Identity service URL: ${process.env.IDENTITY_SERVICE_URL}`);
  logger.info(`Customer service URL: ${process.env.CUSTOMER_SERVICE_URL}`);
  logger.info(`Redis URL: ${process.env.REDIS_URL}`);
});
