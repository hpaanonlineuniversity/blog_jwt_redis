// routes/auth_route.js
import express from 'express';
import { google, signin, signup, refreshToken } from '../controllers/auth_controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.post('/refresh-token', refreshToken); // New refresh token endpoint

export default router;