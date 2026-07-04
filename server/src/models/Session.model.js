import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID reference is required'],
    index: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  expiresAt: {
    type: Date,
    required: [true, 'Session expiry date is required']
  }
}, {
  timestamps: true,
  _id: false // Disable auto-generated ObjectId PK as we use custom string session token as _id
});

// TTL index to automatically prune expired sessions
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Session', SessionSchema);
