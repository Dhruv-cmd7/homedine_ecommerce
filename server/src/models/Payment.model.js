import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID reference is required'],
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID reference is required'],
    index: true
  },
  gateway: {
    type: String,
    required: [true, 'Payment gateway name is required'],
    enum: ['STRIPE', 'PAYPAL', 'ADYEN']
  },
  transactionId: {
    type: String,
    required: [true, 'Gateway transaction reference is required'],
    unique: true,
    index: true
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, 'Payment amount is required'],
    get: (v) => v ? parseFloat(v.toString()) : v
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    uppercase: true,
    match: [/^[A-Z]{3}$/, 'Currency must be a 3-letter ISO code']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'captured', 'failed', 'refunded'],
    default: 'pending'
  },
  rawResponse: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

export default mongoose.model('Payment', PaymentSchema);
