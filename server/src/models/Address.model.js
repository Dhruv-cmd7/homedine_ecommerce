import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID reference is required'],
    index: true
  },
  label: {
    type: String,
    required: [true, 'Address label is required (e.g., Home, Office)'],
    trim: true
  },
  recipientName: {
    type: String,
    required: [true, 'Recipient name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Recipient phone number is required'],
    trim: true,
    match: [/^\+[1-9]\d{1,14}$/, 'Recipient phone must follow E.164 format']
  },
  addressLine1: {
    type: String,
    required: [true, 'Address Line 1 is required'],
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State/Province is required'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code/ZIP is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country code is required'],
    trim: true,
    uppercase: true,
    match: [/^[A-Z]{2}$/, 'Country code must be ISO 3166-1 alpha-2 format']
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

AddressSchema.index({ userId: 1, isDefault: -1 });

export default mongoose.model('Address', AddressSchema);
