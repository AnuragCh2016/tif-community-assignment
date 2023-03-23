import express from 'express'
import { RoleController } from '../controllers/roleController.js'
import { ValidationMiddleware } from '../middlewares/validation.js';

const router = express.Router()

router.post('/',ValidationMiddleware.validateCreateRole(), RoleController.createRole);
router.get('/', RoleController.getRoles);

export default router;