import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import authRepository from './repository.js';
import { cacheManager } from '../../config/cache.js';

export class AuthUsecase {
  constructor(repository) {
    this.repository = repository;
  }

  generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const tokenUuid = crypto.randomUUID();
    const refreshToken = jwt.sign(
      { id: user._id, uuid: tokenUuid },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Save active refresh token instance mapping inside cache to support revocation
    cacheManager.set(`session:${user._id}:${tokenUuid}`, true, 7 * 24 * 3600);

    return { accessToken, refreshToken };
  }

  async registerUser({ firstName, lastName, email, password }) {
    const existingUser = await this.repository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await this.repository.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      verificationToken
    });

    const { accessToken, refreshToken } = this.generateTokens(newUser);

    return {
      user: this.sanitizeUser(newUser),
      accessToken,
      refreshToken
    };
  }

  async loginUser({ email, password }) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.isBlocked) {
      throw new Error('This user account has been blocked');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken
    };
  }

  async refreshUserTokens(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Verify refresh token hasn't been revoked in memory cache
      const isSessionActive = cacheManager.get(`session:${decoded.id}:${decoded.uuid}`);
      if (!isSessionActive) {
        throw new Error('Session has expired or been revoked');
      }

      const user = await this.repository.findById(decoded.id);
      if (!user || user.isBlocked) {
        throw new Error('Access denied or user blocked');
      }

      // Revoke the old refresh token (Token rotation principle)
      cacheManager.delete(`session:${decoded.id}:${decoded.uuid}`);

      // Generate a new token pair
      const tokens = this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async logoutUser(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      // Delete session map from memory cache
      cacheManager.delete(`session:${decoded.id}:${decoded.uuid}`);
      return true;
    } catch (error) {
      // Return true even on error to clear client tokens
      return true;
    }
  }

  async verifyUserEmail(token) {
    const user = await this.repository.findByVerificationToken(token);
    if (!user) {
      throw new Error('Invalid or expired verification link');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await this.repository.updateUser(user);

    return true;
  }

  async requestPasswordReset(email) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      // Return success to mitigate username enumeration attacks
      return true;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    await this.repository.updateUser(user);

    // In actual production, send link email via nodemailer/SendGrid.
    // For now we log it in logs for development verification
    console.log(`[PASS_RESET_TOKEN]: ${resetToken}`);
    return true;
  }

  async resetUserPassword(token, newPassword) {
    const user = await this.repository.findByResetToken(token);
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await this.repository.updateUser(user);

    // Revoke all existing sessions for this user ID (Force re-login)
    cacheManager.clearPrefix(`session:${user._id}:`);
    return true;
  }

  async changeUserPassword(userId, currentPassword, newPassword) {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new Error('Incorrect current password');
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await this.repository.updateUser(user);

    // Force sign out from all other logged sessions
    cacheManager.clearPrefix(`session:${user._id}:`);
    return true;
  }

  sanitizeUser(user) {
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      addresses: user.addresses
    };
  }
}

export default new AuthUsecase(authRepository);
