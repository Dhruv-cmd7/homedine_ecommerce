import User from '../../models/User.model.js';

export class AuthRepository {
  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  async findById(id) {
    return await User.findById(id);
  }

  async findByVerificationToken(token) {
    return await User.findOne({ verificationToken: token });
  }

  async findByResetToken(token) {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
  }

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async updateUser(user) {
    return await user.save();
  }
}

export default new AuthRepository();
