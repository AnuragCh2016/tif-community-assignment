import express from 'express';
import { AuthController } from '../controllers/authController.js';
import { ValidationMiddleware } from '../middlewares/validation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup',ValidationMiddleware.validateSignup(),AuthController.registerUser);
router.post('/signin',ValidationMiddleware.validateSignin(),AuthController.loginUser);
router.route('/me').get(authMiddleware, AuthController.getMe)

export default router;