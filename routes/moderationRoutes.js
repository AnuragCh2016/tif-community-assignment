import express from 'express'
import { ModerationController } from '../controllers/moderationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router()

router.post('/',authMiddleware,ModerationController.addMember);
router.delete('/:id',authMiddleware,ModerationController.removeMember);

export default router;