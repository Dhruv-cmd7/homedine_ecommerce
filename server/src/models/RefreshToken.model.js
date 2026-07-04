import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID reference is required'],
    index: true
  },
  token: {
    type: String,
    required: [true, 'Token string signature is required'],
    unique: true,
    index: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: [true, 'Refresh token expiry date is required']
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// TTL index to delete refresh tokens on expiration
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('RefreshToken', RefreshTokenSchema);
