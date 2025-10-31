import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
import { JWT_SECRET } from '../configs/config.js'
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  console.log(token);
  
  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized'));
    }
    req.user = user;
    next();
  });
};