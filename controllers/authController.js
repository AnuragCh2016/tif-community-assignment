import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator';

export class AuthController {
    static registerUser = async(req,res) => {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    status:false,
                    error:errors.array()
                });
            }
            const {name,email,password} = req.body;
            const user = await User.create({
                name,
                email,
                password
            });

            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});
            res.status(201).json({
                status:true,
                content:{
                    data:{
                        id:user._id,
                        name:user.name,
                        email:user.email,
                        created_at: user.createdAt
                    },
                    meta:{
                        access_token:token
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                status:false,
                error:error.message
            });
        }
    }

    static loginUser = async(req,res) => {
        const {email,password} = req.body;
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    status:false,
                    error:errors.array()
                });
            } else {
                const user = await User.findOne({email});
                if(user && (await user.comparePassword(password))){
                    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME});
                    res.status(200).json({
                        status:true,
                        content:{
                            data:{
                                id:user._id,
                                name:user.name,
                                email:user.email,
                                created_at: user.createdAt
                            },
                            meta:{
                                access_token:token
                            }
                        }
                    });
                } else {
                    res.status(400).json({
                        status:false,
                        error:'Invalid credentials'
                    });
                }
            }
        } catch(error){
            res.status(500).json({
                status:false,
                error:error.message
            });
        }
    }

    static getMe = async(req,res) => {
        const id = req.data;
        try {
            const user = await User.findOne({_id:id});
            res.status(200).json({
                status:true,
                content:{
                    data:{
                        id:user._id,
                        name:user.name,
                        email:user.email,
                        created_at: user.createdAt
                    }
                }
            });
        } catch (error) {
            res.status(500).json({
                status:false,
                error:error.message
            });
        }
    }
}