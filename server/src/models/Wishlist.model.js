import mongoose from 'mongoose';

const WishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductVariant'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID reference is required'],
    unique: true,
    index: true
  },
  items: [WishlistItemSchema]
}, {
  timestamps: true
});

export default mongoose.model('Wishlist', WishlistSchema);
