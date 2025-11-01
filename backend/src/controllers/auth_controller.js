// controllers/auth_controller.js
import User from '../models/user_model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import { 
  generateTokens, 
  verifyRefreshToken, 
  storeRefreshToken, 
  getRefreshToken,
  removeRefreshToken,
  addToBlacklist 
} from '../utils/jwt.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || username === '' || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    
    // Generate tokens
    const tokens = generateTokens({
      id: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin
    });

    // Store refresh token in Redis
    await storeRefreshToken(newUser._id.toString(), tokens.refreshToken);

    // Set cookies
    res
      .cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })
      .cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .status(201)
      .json({
        message: 'Signup successful',
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
          isAdmin: newUser.isAdmin
        }
      });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    // Generate tokens
    const tokens = generateTokens({
      id: validUser._id.toString(),
      username: validUser.username,
      email: validUser.email,
      isAdmin: validUser.isAdmin
    });

    // Store refresh token in Redis
    await storeRefreshToken(validUser._id.toString(), tokens.refreshToken);

    const { password: pass, ...userWithoutPassword } = validUser._doc;

    res
      .cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })
      .cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .status(200)
      .json({
        message: 'Signin successful',
        user: userWithoutPassword
      });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refresh_token;

    if (!oldRefreshToken) {
      return next(errorHandler(401, 'Refresh token required'));
    }
    
    console.log('🔄 Refresh token process started');
    
    // 1. Verify old token
    const decoded = verifyRefreshToken(oldRefreshToken);
    console.log('👤 User ID:', decoded.id);
    
    // 2. Check if token exists in Redis and matches
    const storedToken = await getRefreshToken(decoded.id);
    console.log('🔍 Stored token matches:', storedToken === oldRefreshToken);
    
    if (storedToken !== oldRefreshToken) {
      // Possible token reuse attack! Blacklist all tokens for this user
      console.log('🚨 Security violation - token reuse detected!');
      await removeRefreshToken(decoded.id);
      
      // ✅ CORRECT: Add to blacklist
      await addToBlacklist(oldRefreshToken, 7 * 24 * 60 * 60);
      
      return next(errorHandler(401, 'Security violation - token reused'));
    }
    
    // ✅ CORRECT: Add old refresh token to blacklist
    await addToBlacklist(oldRefreshToken, 7 * 24 * 60 * 60);
    console.log('✅ Old refresh token blacklisted');

    // Generate new tokens
    const tokens = generateTokens({
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      isAdmin: decoded.isAdmin
    });

    // Update refresh token in Redis
    await storeRefreshToken(decoded.id, tokens.refreshToken);
    console.log('✅ New refresh token stored');

    // Set new cookies
    res
      .cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
      })
      .cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({
        message: 'Token refreshed successfully'
      });

    console.log('✅ Token refresh completed');

  } catch (error) {
    console.error('❌ Refresh token error:', error);
    next(errorHandler(401, 'Invalid refresh token'));
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    let currentUser;

    if (user) {
      currentUser = user;
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      
      const newUser = new User({
        username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      
      await newUser.save();
      currentUser = newUser;
    }

    // Generate tokens
    const tokens = generateTokens({
      id: currentUser._id.toString(),
      username: currentUser.username,
      email: currentUser.email,
      isAdmin: currentUser.isAdmin
    });

    // Store refresh token in Redis
    await storeRefreshToken(currentUser._id.toString(), tokens.refreshToken);

    const { password, ...userWithoutPassword } = currentUser._doc;

    res
      .cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
      })
      .cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .status(200)
      .json({
        message: 'Google authentication successful',
        user: userWithoutPassword
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    console.log('🚪 Logout process started');
    console.log('🔑 Access Token present:', !!accessToken);
    console.log('🔑 Refresh Token present:', !!refreshToken);

    if (refreshToken) {
      try {
        // Verify and get user info from refresh token
        const decoded = verifyRefreshToken(refreshToken);
        console.log('👤 User ID from token:', decoded.id);
        
        // Remove refresh token from Redis
        await removeRefreshToken(decoded.id);
        console.log('✅ Refresh token removed from Redis');
        
        // ✅ CORRECT: Add refresh token to blacklist (7 days)
        await addToBlacklist(refreshToken, 7 * 24 * 60 * 60);
        console.log('✅ Refresh token added to blacklist');
        
      } catch (error) {
        // Token might be expired, but we still want to clear cookies
        console.log('⚠️ Refresh token might be expired during logout:', error.message);
      }
    }

    if (accessToken) {
      // ✅ CORRECT: Add access token to blacklist (15 minutes)
      await addToBlacklist(accessToken, 15 * 60);
      console.log('✅ Access token added to blacklist');
    }

    // Clear cookies
    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .status(200)
      .json({
        message: 'Logout successful'
      });

    console.log('✅ Logout completed successfully');

  } catch (error) {
    console.error('❌ Logout error:', error);
    next(errorHandler(500, 'Logout failed'));
  }
};