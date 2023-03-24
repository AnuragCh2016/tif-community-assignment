import { body, validationResult } from 'express-validator';
import Role from '../models/Role.js';
import User from '../models/User.js';
import Community from '../models/Community.js';
import Member from '../models/Member.js';

export class ValidationMiddleware {
    static validateSignup() {
        return [
            body('name')
                .notEmpty().withMessage('Name is required')
                .isLength({ min: 2 }).withMessage('Name should be at least 2 characters long'),
            body('email')
                .notEmpty().withMessage('Email is required')
                .isEmail().withMessage('Invalid email address')
                .custom(async (value) => {
                    const user = await User.findOne({ email: value });
                    if (user) {
                        throw new Error('User with this email address already exists.');
                    }
                    return true;
                }),
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
                .withMessage('Please provide a valid email address'),
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

    static validateCreateCommunity() {
        return [
            body('name')
                .notEmpty()
                .withMessage('Name is required')
                .isLength({ min: 2 })
                .withMessage('Name should be at least 2 characters.'),
        ];
    }

    static validateAddMember(){
        return [
            body('community')
                .notEmpty().withMessage('Community is required')
                .custom(async function (value) {
                    const community = await Community.findOne({_id:value});
                    if(!community){
                        return Promise.reject('Community not found');
                    }
                    this.community = community;
                }),
            body('user')
                .notEmpty().withMessage('User is required')
                .custom(async (value) => {
                    const user = await User.findOne({ _id: value });
                    if (!user) {
                        return Promise.reject('User not found');
                    }
                })
                .custom(async function (value) {
                    const member = await Member.findOne({user:value, community:this.community});
                    if(member){
                        return Promise.reject('User is already added in the community');
                    }
                }),
            body('role')
                .notEmpty().withMessage('Role is required')
                .custom(async (value) => {
                    const role = await Role.findOne({_id:value});
                    if(!role){
                        return Promise.reject('Role not found');
                    }
                })
        ]
    }
}
