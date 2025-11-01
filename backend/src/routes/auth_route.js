// routes/auth_routes.js
import express from 'express';
import { signup, signin, refreshToken, google, logout } from '../controllers/auth_controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh-token', refreshToken);
router.post('/google', google);
router.post('/logout', logout);

export default router;