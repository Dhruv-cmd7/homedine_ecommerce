import mongoose from 'mongoose';

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [50, 'Role name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Role', RoleSchema);
