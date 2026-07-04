import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { apiLimiter } from './middleware/rate-limiter.js';
import { errorHandler } from './middleware/error.middleware.js';
import routes from './routes.js';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Configure CORS to whitelist local client and production domain
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Apply global rate limiting to all api endpoints
app.use('/api', apiLimiter);

// Base Health Check endpoint
app.use('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Homedine API Server is fully operational.',
    timestamp: new Date()
  });
});

// Mount main routing endpoints
app.use('/api/v1', routes);

// Catch-all route for unmatched paths (404 Page Not Found)
app.use((req, res, next) => {
  const error = new Error(`Cannot find requested route ${req.originalUrl} on this server.`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handler
app.use(errorHandler);

export default app;
