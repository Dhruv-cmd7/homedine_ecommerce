import mongoose from 'mongoose';

const RefundSchema = new mongoose.Schema({
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    required: [true, 'Payment ID reference is required'],
    index: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID reference is required'],
    index: true
  },
  reason: {
    type: String,
    required: [true, 'Reason for refund is required'],
    trim: true
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, 'Refund amount is required'],
    get: (v) => v ? parseFloat(v.toString()) : v
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'succeeded', 'failed'],
    default: 'pending'
  },
  gatewayRefundId: {
    type: String,
    required: [true, 'Gateway refund transaction reference is required'],
    unique: true,
    index: true
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin/Staff processor ID is required']
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

export default mongoose.model('Refund', RefundSchema);
