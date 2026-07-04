import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['PRODUCT_VIEW', 'ADD_TO_CART', 'CHECKOUT_START', 'PURCHASE', 'SEARCH_QUERY', 'BANNER_CLICK'],
    index: true
  },
  payload: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Only track creation time
});

AnalyticsSchema.index({ eventType: 1, createdAt: -1 });
// TTL index: auto delete analytics records after 30 days
AnalyticsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model('Analytics', AnalyticsSchema);
