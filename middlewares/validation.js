import { body, validationResult } from 'express-validator';
import Role from '../models/Role.js';

export class ValidationMiddleware {
    static validateSignup() {
        return [
            body('name')
                .notEmpty()
                .withMessage('Name is required')
                .isLength({ min: 2 })
                .withMessage('Name should be at least 2 characters long'),
            body('email')
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Invalid email address'),
            body('password')
                .notEmpty()
                .withMessage('Password is required')
                .isLength({ min: 6 })
                .withMessage('Password should be at least 6 characters long'),
        ];
    }

    static validateSignin() {
        return [
            body('email')
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Invalid email address'),
            body('password')
                .notEmpty()
                .withMessage('Password is required')
        ];
    }

    static validateCreateRole() {
        return [
            body('name')
                .notEmpty()
                .withMessage('Name is required')
                .isLength({ min: 2 })
                .withMessage('Name should be at least 2 characters long')
                .custom(async (value) => {
                    const role = await Role.findOne({ name: value });
                    if (role) {
                        return Promise.reject('Role with this name already exists');
                    }
                }),
        ];
    }

    static validateCreateCommunity(){
        return [
            body('name')
                .notEmpty()
                .withMessage('Name is required')
                .isLength({ min: 2 })
                .withMessage('Name should be at least 2 characters long'),
        ];
    }
}
