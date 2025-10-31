import express from 'express';
import { google, signin, signup } from '../controllers/auth_controller.js';

const router = express.Router();


router.post('/signup', signup);  //ok , test by bash script
router.post('/signin', signin);  //ok , test by bash script
router.post('/google', google)   // ok, test from frontend

export default router;