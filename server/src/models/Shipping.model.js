import mongoose from 'mongoose';

const ShippingHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  location: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const ShippingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID reference is required'],
    unique: true,
    index: true
  },
  carrier: {
    type: String,
    required: [true, 'Carrier name is required (e.g. FedEx, UPS)'],
    trim: true
  },
  trackingNumber: {
    type: String,
    required: [true, 'Tracking number is required'],
    unique: true,
    index: true,
    trim: true
  },
  shippingLabelUrl: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['label_created', 'in_transit', 'out_for_delivery', 'delivered', 'returned'],
    default: 'label_created',
    index: true
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  history: [ShippingHistorySchema]
}, {
  timestamps: true
});

export default mongoose.model('Shipping', ShippingSchema);
