import mongoose from 'mongoose';

const ProductVariantSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID reference is required'],
    index: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9-]{6,30}$/, 'SKU must be uppercase alphanumeric and hyphens, 6-30 chars']
  },
  name: {
    type: String,
    required: [true, 'Variant name is required (e.g. Size/Color details)'],
    trim: true
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: [true, 'Variant price is required'],
    get: (v) => v ? parseFloat(v.toString()) : v
  },
  compareAtPrice: {
    type: mongoose.Schema.Types.Decimal128,
    get: (v) => v ? parseFloat(v.toString()) : v
  },
  attributes: [
    {
      name: { type: String, required: true },
      value: { type: String, required: true }
    }
  ],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

ProductVariantSchema.index({ productId: 1, price: 1 });

export default mongoose.model('ProductVariant', ProductVariantSchema);
