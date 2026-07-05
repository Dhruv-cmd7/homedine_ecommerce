import mongoose from 'mongoose';
import winston from 'winston';

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

let mongoMemoryServer = null;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.warn(`Failed to connect to primary MongoDB: ${error.message}`);
    
    // Only attempt in-memory fallback if in development mode
    if (process.env.NODE_ENV === 'development') {
      logger.info('Starting Mongo Memory Server fallback for development...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoMemoryServer = await MongoMemoryServer.create();
        const memoryUri = mongoMemoryServer.getUri();
        
        const conn = await mongoose.connect(memoryUri);
        logger.info(`Memory MongoDB Connected: ${conn.connection.host} (${memoryUri})`);

        logger.info('Auto-seeding memory database with categories, brands, and products...');
        const { default: seedMemory } = await import('./seedMemory.js');
        await seedMemory();
        logger.info('Memory database seeded successfully.');
      } catch (memError) {
        logger.error(`Critical: Failed to launch memory database: ${memError.message}`);
        process.exit(1);
      }
    } else {
      logger.error('Database connection failed in production. Memory database fallback skipped.');
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB connection error: ${err.message}`);
});
