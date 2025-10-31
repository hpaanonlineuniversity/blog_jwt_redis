// utils/verifyUser.js
import { errorHandler } from './error.js';
import { verifyAccessToken, isTokenBlacklisted } from './jwt.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token || 
                 req.header('Authorization')?.replace('Bearer ', '');

    console.log("token :", req.cookies.access_token);

    if (!token) {
      return next(errorHandler(401, 'Access token required'));
    }

    // Check if token is blacklisted
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return next(errorHandler(401, 'Token has been revoked'));
    }

    // Verify token
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    return next(errorHandler(401, 'Invalid or expired token'));
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