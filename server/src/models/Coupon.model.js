import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z0-9_-]{3,20}$/, 'Coupon code must be 3-20 characters uppercase alphanumeric, hyphens/underscores']
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    required: [true, 'Discount type is required']
  },
  discountValue: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, 'Discount value is required'],
    get: (v) => v ? parseFloat(v.toString()) : v
  },
  minOrderAmount: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0.00,
    get: (v) => v ? parseFloat(v.toString()) : v
  },
  maxDiscountAmount: {
    type: mongoose.Schema.Types.Decimal128,
    get: (v) => v ? parseFloat(v.toString()) : v
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function(v) {
        return this.startDate ? v > this.startDate : true;
      },
      message: 'End date must be after start date'
    }
  },
  usageLimit: {
    type: Number,
    required: [true, 'Usage limit is required'],
    min: [1, 'Usage limit must be at least 1']
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

CouponSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

export default mongoose.model('Coupon', CouponSchema);
