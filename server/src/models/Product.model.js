import mongoose from 'mongoose';
import crypto from 'crypto';

const ProductSchema = new mongoose.Schema({
  publicId: {
    type: String,
    default: () => crypto.randomUUID(),
    unique: true,
    index: true
  },
  sku: {
    type: String,
    required: [true, 'Product SKU is required'],
    unique: true,
    index: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [120, 'Product title cannot exceed 120 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product category assignment is required'],
    index: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Product brand assignment is required'],
    index: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  images: [{
    type: String // Cloudinary URLs
  }],
  variants: [{
    variantSku: {
      type: String,
      required: true,
      unique: true,
      sparse: true
    },
    colorName: { type: String },
    colorHex: { type: String },
    size: { type: String },
    price: { type: Number },
    stock: { type: Number, default: 0, min: 0 }
  }],
  specifications: [{
    key: { type: String, required: true },
    value: { type: String, required: true }
  }],
  rating: {
    average: { type: Number, default: 5.0, min: 1, max: 5 },
    count: { type: Number, default: 0 }
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isBestseller: {
    type: Boolean,
    default: false,
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }]
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

// Compound indexes for optimized filtering queries
ProductSchema.index({ category: 1, price: 1, isActive: 1 });
ProductSchema.index({ brand: 1, price: 1, isActive: 1 });
ProductSchema.index({ title: 'text', description: 'text' }); // Full Text Search index

// Soft delete query middleware
ProductSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export default mongoose.model('Product', ProductSchema);
