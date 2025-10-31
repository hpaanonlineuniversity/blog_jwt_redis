// utils/jwt.js
import jwt from 'jsonwebtoken';
import redisClient from '../configs/redis.js';

export const generateTokens = (payload) => {
  const accessToken = jwt.sign(
    payload, 
    process.env.JWT_ACCESS_SECRET, 
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
  );
  
  const refreshToken = jwt.sign(
    payload, 
    process.env.JWT_REFRESH_SECRET, 
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
  );

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Add token to blacklist
export const addToBlacklist = async (token, expiry) => {
  const tokenHash = Buffer.from(token).toString('base64');
  await redisClient.set(`blacklist:${tokenHash}`, true, expiry);
};

// Check if token is blacklisted
export const isTokenBlacklisted = async (token) => {
  const tokenHash = Buffer.from(token).toString('base64');
  return await redisClient.exists(`blacklist:${tokenHash}`);
};

// Store refresh token in Redis
export const storeRefreshToken = async (userId, refreshToken) => {
  const expiry = 7 * 24 * 60 * 60; // 7 days in seconds
  await redisClient.set(`refresh_token:${userId}`, refreshToken, expiry);
};

// Get refresh token from Redis
export const getRefreshToken = async (userId) => {
  return await redisClient.get(`refresh_token:${userId}`);
};

// Remove refresh token from Redis (on logout)
export const removeRefreshToken = async (userId) => {
  await redisClient.del(`refresh_token:${userId}`);
};