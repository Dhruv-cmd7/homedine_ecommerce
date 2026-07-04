import authUsecase from './usecase.js';

const COOKIE_NAME = 'refreshToken';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
});

export class AuthController {
  constructor(usecase) {
    this.usecase = usecase;
  }

  async register(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.usecase.registerUser({
        firstName,
        lastName,
        email,
        password
      });

      res.cookie(COOKIE_NAME, refreshToken, getCookieOptions());
      res.status(201).json({
        success: true,
        data: { user, accessToken },
        message: 'Account registered successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await this.usecase.loginUser({
        email,
        password
      });

      res.cookie(COOKIE_NAME, refreshToken, getCookieOptions());
      res.status(200).json({
        success: true,
        data: { user, accessToken },
        message: 'Authentication successful.'
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const clientToken = req.cookies[COOKIE_NAME];
      if (!clientToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token session missing'
        });
      }

      const { accessToken, refreshToken } = await this.usecase.refreshUserTokens(clientToken);

      res.cookie(COOKIE_NAME, refreshToken, getCookieOptions());
      res.status(200).json({
        success: true,
        data: { accessToken }
      });
    } catch (error) {
      // Clear invalid session cookies
      res.clearCookie(COOKIE_NAME, { path: '/api/v1/auth' });
      res.status(401).json({
        success: false,
        message: error.message || 'Authentication refresh failed'
      });
    }
  }

  async logout(req, res, next) {
    try {
      const clientToken = req.cookies[COOKIE_NAME];
      if (clientToken) {
        await this.usecase.logoutUser(clientToken);
      }

      res.clearCookie(COOKIE_NAME, { path: '/api/v1/auth' });
      res.status(200).json({
        success: true,
        message: 'Session signed out successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;
      await this.usecase.verifyUserEmail(token);
      res.status(200).json({
        success: true,
        message: 'Email address verified successfully.'
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await this.usecase.requestPasswordReset(email);
      res.status(200).json({
        success: true,
        message: 'If the email matches an account, a password reset link was sent.'
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      await this.usecase.resetUserPassword(token, password);
      res.status(200).json({
        success: true,
        message: 'Password has been successfully updated.'
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
      await this.usecase.changeUserPassword(userId, currentPassword, newPassword);
      
      // Clear refresh cookies of this session
      res.clearCookie(COOKIE_NAME, { path: '/api/v1/auth' });
      res.status(200).json({
        success: true,
        message: 'Password changed successfully. Please log in again.'
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await this.usecase.repository.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User profile not found'
        });
      }
      res.status(200).json({
        success: true,
        data: { user: this.usecase.sanitizeUser(user) }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController(authUsecase);
