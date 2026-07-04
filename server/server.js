import dotenv from 'dotenv';
import winston from 'winston';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';

// Load environment variables configuration
dotenv.config();

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Uncaught Exceptions handling
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION! Server shutting down... Error: ${err.message}`, {
    stack: err.stack
  });
  process.exit(1);
});

// Connect to MongoDB Database
connectDB();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Unhandled Rejections handling
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION! Server shutting down gracefully... Error: ${err.message}`, {
    stack: err.stack
  });
  server.close(() => {
    process.exit(1);
  });
});
