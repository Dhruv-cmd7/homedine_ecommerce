import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant',
    required: [true, 'Variant ID reference is required'],
    unique: true,
    index: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  availableQty: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: [0, 'Available quantity cannot be negative'],
    default: 0
  },
  reservedQty: {
    type: Number,
    required: [true, 'Reserved quantity is required'],
    min: [0, 'Reserved quantity cannot be negative'],
    default: 0
  },
  warehouseLocation: {
    type: String,
    trim: true
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  version: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Inventory', InventorySchema);
