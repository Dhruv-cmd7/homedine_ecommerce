import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID reference is required'],
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  body: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['queued', 'sent', 'delivered', 'failed', 'read'],
    default: 'queued'
  },
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  sentAt: {
    type: Date
  }
}, {
  timestamps: true
});

NotificationSchema.index({ userId: 1, status: 1 });
// TTL index: automatically delete notifications after 90 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model('Notification', NotificationSchema);
