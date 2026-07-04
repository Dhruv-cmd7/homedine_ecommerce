import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Banner image URL is required'],
    trim: true
  },
  linkUrl: {
    type: String,
    trim: true
  },
  placement: {
    type: String,
    required: true,
    enum: ['hero_carousel', 'promo_bar', 'sidebar_banner'],
    default: 'hero_carousel'
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
  sortOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

BannerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

export default mongoose.model('Banner', BannerSchema);
