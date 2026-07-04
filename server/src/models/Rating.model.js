import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID reference is required'],
    unique: true,
    index: true
  },
  averageRating: {
    type: Number,
    required: true,
    min: 1.0,
    max: 5.0,
    default: 5.0
  },
  totalReviews: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  ratingDistribution: {
    1: { type: Number, default: 0 },
    2: { type: Number, default: 0 },
    3: { type: Number, default: 0 },
    4: { type: Number, default: 0 },
    5: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

export default mongoose.model('Rating', RatingSchema);
