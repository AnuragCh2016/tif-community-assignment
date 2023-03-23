import Role from "../models/Role.js";
import { validationResult } from "express-validator";

export class RoleController{
    static createRole = async (req, res) => {
        const {name} = req.body;
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return res.status(400).json({
                    status:false,
                    error:errors.array()
                });
            }
            const role = await Role.create({name});
            res.status(201).json({
                status:true,
                content:{
                    data:{
                        id:role._id,
                        name:role.name,
                        created_at:role.createdAt,
                        updated_at:role.updatedAt
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

    static getRoles = async (req, res) => {
        const {page=1, limit=10} = req.query;
        try {
            const roles = await Role.aggregate([
                { $match: {} }, //any filters to match
                { 
                  $project: {
                    _id: 1,
                    name: 1,
                    scopes: 1,
                    created_at: "$createdAt",
                    updated_at: "$updatedAt"
                  }
                },
                { $skip: (page - 1) * limit },
                { $limit: limit }
              ]);
              
            const count = await Role.countDocuments();
            res.status(200).json({
                status:true,
                content:{
                    meta:{
                        total:count,
                        pages:Math.ceil(count/limit),
                        page
                    },
                    data:roles
                }
            });
        } catch(error) {
            res.status(500).json({
                status:false,
                error:error.message
            });
        }
    } 
}