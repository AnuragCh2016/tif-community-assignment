import express from 'express'
import { UserController } from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import { ValidationMiddleware } from '../middlewares/validation.js'

const router = express.Router()

router.post('/',ValidationMiddleware.validateCreateCommunity(),authMiddleware, UserController.createCommunity);
router.get('/',UserController.viewCommunities);
router.get('/:id/members',UserController.viewMembers);
router.get('/me/owner',authMiddleware,UserController.getOwnedCommunities);
router.get('/me/member',authMiddleware,UserController.getJoinedCommunities);

export default router;