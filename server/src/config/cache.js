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

// Resilient in-memory cache implementation to avoid external dependencies
class MemoryCache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value, ttlSeconds = 300) {
    const expiresAt = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiresAt });
    logger.debug(`Cache set for key: ${key}, TTL: ${ttlSeconds}s`);
  }

  get(key) {
    const cachedItem = this.cache.get(key);
    if (!cachedItem) {
      return null;
    }

    if (Date.now() > cachedItem.expiresAt) {
      this.cache.delete(key);
      logger.debug(`Cache expired and deleted for key: ${key}`);
      return null;
    }

    logger.debug(`Cache hit for key: ${key}`);
    return cachedItem.value;
  }

  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug(`Cache deleted for key: ${key}`);
    }
  }

  clear() {
    this.cache.clear();
    logger.info('Cache cleared completely');
  }

  // Clear keys starting with a specific prefix (e.g. invalidating a category)
  clearPrefix(prefix) {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    logger.info(`Cleared ${count} cached items matching prefix: ${prefix}`);
  }
}

export const cacheManager = new MemoryCache();
export default cacheManager;
