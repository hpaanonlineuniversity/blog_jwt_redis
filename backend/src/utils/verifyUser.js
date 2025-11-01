// utils/verifyUser.js
import { errorHandler } from './error.js';
import { verifyAccessToken, isTokenBlacklisted } from './jwt.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token || 
                 req.header('Authorization')?.replace('Bearer ', '');

    //console.log("Token from cookies:", token ? "Exists" : "Missing");

    if (!token) {
      return next(errorHandler(401, 'Access token required'));
    }

    // Check if token is blacklisted - with error handling
    try {
      const isBlacklisted = await isTokenBlacklisted(token);
      //console.log("Is token blacklisted:", isBlacklisted);
      
      if (isBlacklisted) {
        return next(errorHandler(401, 'Token has been revoked'));
      }
    } catch (redisError) {
      console.error('Redis blacklist check failed:', redisError);
      // Continue without blacklist check if Redis has issues
    }

    // Verify token
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      //console.log("Token verified for user:", decoded.id);
      next();
    } catch (jwtError) {
      console.log('JWT verification failed:', jwtError.message);
      return next(errorHandler(401, 'Invalid or expired token'));
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return next(errorHandler(401, 'Authentication failed'));
  }
};

export const verifyAdmin = async (req, res, next) => {
  try {
    await verifyToken(req, res, (err) => {
      if (err) return next(err);
      
      if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Admin access required'));
      }
      next();
    });
  } catch (error) {
    next(error);
  }
};