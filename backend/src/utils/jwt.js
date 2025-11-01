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

// utils/jwt.js - FIXED VERSION

// Add token to blacklist - COMPLETELY FIXED
export const addToBlacklist = async (token, expiry) => {
  try {
    const tokenHash = Buffer.from(token).toString('base64');
    const key = `blacklist:${tokenHash}`;
    
    console.log(`🔄 Attempting to blacklist token: ${key.substring(0, 30)}...`);
    console.log(`⏰ Expiry: ${expiry} seconds`);
    
    // ✅ CORRECT: Store as simple string without JSON.stringify
    const result = await redisClient.set(key, 'true', 'EX', expiry);
    
    if (result) {
      console.log(`✅ SUCCESS: Token blacklisted: ${key.substring(0, 30)}...`);
      
      // Verify it was actually stored
      const verify = await redisClient.get(key);
      console.log(`🔍 Verification: ${key.substring(0, 30)}... = ${verify}`);
    } else {
      console.log(`❌ FAILED: Could not blacklist token`);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Blacklist error:', error);
    throw error;
  }
};

// Check if token is blacklisted - FIXED
export const isTokenBlacklisted = async (token) => {
  try {
    const tokenHash = Buffer.from(token).toString('base64');
    const key = `blacklist:${tokenHash}`;
    const result = await redisClient.get(key);
    
    console.log(`🔍 Blacklist check: ${key.substring(0, 30)}... = ${result}`);
    return result === 'true';
  } catch (error) {
    console.error('❌ Blacklist check error:', error);
    return false;
  }
};

// Store refresh token in Redis - FIXED
export const storeRefreshToken = async (userId, refreshToken) => {
  const expiry = 7 * 24 * 60 * 60; // 7 days in seconds
  const key = `refresh_token:${userId}`;
  
  console.log(`🔄 Storing refresh token for user: ${userId}`);
  const result = await redisClient.set(key, refreshToken, 'EX', expiry);
  
  if (result) {
    console.log(`✅ Refresh token stored: ${key}`);
    
    // Verify storage
    const verify = await redisClient.get(key);
    console.log(`🔍 Refresh token verification: ${key} = ${verify ? 'Exists' : 'Missing'}`);
  }
  
  return result;
};

// Get refresh token from Redis - FIXED
export const getRefreshToken = async (userId) => {
  const key = `refresh_token:${userId}`;
  const result = await redisClient.get(key);
  
  console.log(`🔍 Getting refresh token: ${key} = ${result ? 'Exists' : 'Missing'}`);
  return result;
};

// Remove refresh token from Redis - FIXED
export const removeRefreshToken = async (userId) => {
  const key = `refresh_token:${userId}`;
  console.log(`🗑️ Removing refresh token: ${key}`);
  
  const result = await redisClient.del(key);
  console.log(`✅ Refresh token removed: ${key} - Success: ${result}`);
  
  return result;
};