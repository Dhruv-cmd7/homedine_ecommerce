import mongoose from 'mongoose';

const PermissionSchema = new mongoose.Schema({
  action: {
    type: String,
    required: [true, 'Permission action is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z]+:[a-z_]+$/, 'Action must match format action:module_name']
  },
  module: {
    type: String,
    required: [true, 'Module name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Permission', PermissionSchema);
