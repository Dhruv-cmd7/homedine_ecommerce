import mongoose from 'mongoose';

const ProductImageSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID reference is required'],
    index: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    index: true
  },
  url: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  altText: {
    type: String,
    trim: true,
    default: ''
  },
  isPrimary: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  }
}, {
  timestamps: true
});

ProductImageSchema.index({ productId: 1, sortOrder: 1 });

export default mongoose.model('ProductImage', ProductImageSchema);
