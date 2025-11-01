// routes/user_route.js
import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  test,
  updateUser,
  updateUserAdmin,
} from '../controllers/user_controller.js';
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', verifyToken, test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);

router.get('/getusers', verifyToken, verifyAdmin, getUsers);
router.get('/:userId', getUser);
router.put('/update-admin/:userId', verifyToken, verifyAdmin, updateUserAdmin);

export default router;