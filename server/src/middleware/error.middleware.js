import winston from 'winston';

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

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log the complete error stack trace
  logger.error(`[Express Error Handler]: ${err.message}`, {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error'
  };

  // Redact stack trace in production environment
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
