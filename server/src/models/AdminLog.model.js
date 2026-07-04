import mongoose from 'mongoose';

const AdminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin ID reference is required'],
    index: true
  },
  action: {
    type: String,
    required: [true, 'Action name is required'],
    enum: ['UPDATE_PRODUCT', 'DELETE_USER', 'ISSUE_REFUND', 'CREATE_COUPON', 'UPDATE_INVENTORY', 'MODIFY_ROLE'],
    trim: true
  },
  targetCollection: {
    type: String,
    required: true,
    trim: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  previousState: {
    type: mongoose.Schema.Types.Mixed
  },
  newState: {
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

// TTL index to automatically delete logs after 1 year (31,536,000 seconds)
AdminLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

export default mongoose.model('AdminLog', AdminLogSchema);
