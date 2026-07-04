import mongoose from 'mongoose';
import crypto from 'crypto';

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantSku: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  publicId: {
    type: String,
    default: () => crypto.randomUUID(),
    unique: true,
    index: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    default: null
  },
  guestEmail: {
    type: String
  },
  items: [OrderItemSchema],
  totals: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true,
      default: 0
    },
    shipping: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true
    }
  },
  shippingAddress: {
    recipient: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'failed'],
    default: 'unpaid'
  },
  fulfillmentStatus: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'processing'
  },
  stripePaymentIntentId: {
    type: String,
    index: true
  },
  couponUsed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  optimisticConcurrency: true
});

// Soft delete query middleware
OrderSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export default mongoose.model('Order', OrderSchema);
