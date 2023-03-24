import Community from "../models/Community.js";
import Member from "../models/Member.js";
import Role from "../models/Role.js";
import { validationResult } from "express-validator";
import { generateErrCode } from "../utils/generateErrorCode.js";

export class UserController {
    static createCommunity = async(req,res) => {
        //when community created, user logged in is automatically granted role of Community Admin
        //also member is added with communityID from new community with the role as community admin
        try {
            //create community and add owner as id of logged in person
            const id = req.data;
            const {name} = req.body;
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                const transformedErrors = errors.array().map((error) => ({
                    param: error.param,
                    message: error.msg,
                    code: generateErrCode(error.msg),
                  }));

                return res.status(400).json({
                    status:false,
                    error:transformedErrors
                });
            }
            const community = await Community.create({name});
            community.owner = id;
            await community.save();
            
            //if I am creating community, then role is Community Admin. Find id of same to create member
            const role = await Role.findOne({name:"Community Admin"});
            
            //for logged in user, create a Member document with community id, member id and role
            const member = await Member.create({
                community:community._id,
                user:id,
                role:role._id
            });
            res.status(201).json({
                status:true,
                content:{
                    data:{
                        id:community._id,
                        name:community.name,
                        slug:community.slug,
                        owner:id,
                        created_at:community.createdAt,
                        updated_at:community.updatedAt
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

    static viewCommunities = async(req,res) => {
        //view all communities, expand owner details to get id and name of owner
        //Paginate results
        const {limit=10, page=1} = req.query;
        try {
            const communities = await Community.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner"
                    }
                }, {
                    $unwind:"$owner"
                },{
                    $project:{
                        _id:1,
                        name:1,
                        slug:1,
                        owner:{
                            id:"$owner._id",
                            name:"$owner.name"
                        },
                        created_at:"$createdAt",
                        updated_at:"$updatedAt"
                    }
                },
                { $skip: (page - 1) * limit },
                { $limit: limit }
              ]);
            const count = await Community.countDocuments();
            res.status(200).json({
                status:true,
                content:{
                    meta:{
                        total:count,
                        pages:Math.ceil(count/limit),
                        page
                    },
                    data:communities
                }
            });
        } catch (error) {
            res.status(500).json({
                status:false,
                error:error.message
            });
        }
    }

    static viewMembers = async (req, res) => {
        //to view all members within a community
        //id is passed as a parameter
        const {id} = req.params;
        const {limit=10, page=1} = req.query;
        try {
            const members = await Member.aggregate([{
                    $match:{
                        community:id
                    }
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"user",
                        foreignField:"_id",
                        as:"user"
                    }
                },
                {
                    $unwind:"$user"
                },
                {
                    $lookup:{
                        from:"roles",
                        localField:"role",
                        foreignField:"_id",
                        as:"role"
                    }
                },
                {
                    $unwind:"$role"
                },
                {
                    $project:{
                        _id:1,
                        user:{
                            id:"$user._id",
                            name:"$user.name"
                        },
                        role:{
                            id:"$role._id",
                            name:"$role.name"
                        },
                        created_at:"$createdAt",
                        updated_at:"$updatedAt"
                    }
                },
                { $skip: (page - 1) * limit },
                { $limit: limit }
              ]);
            const count = await Member.countDocuments();
            res.status(200).json({
                status:true,
                content:{
                    meta:{
                        total:count,
                        pages:Math.ceil(count/limit),
                        page
                    },
                    data:members
                }
            });
        } catch(error){
            res.status(500).json({
                status:false,
                error:error.message
            });
        }
    }
    
    static getOwnedCommunities = async(req,res) => {
        //to get details of communities owned by me
        //get id from middleware and match according to that
        try {
            const id = req.data;
            const {limit=10,page=1} = req.query;
            const communities = await Community.aggregate([
                {
                    $match:{
                        owner:id
                    }
                },
                {
                    $project:{
                        _id:1,
                        name:1,
                        slug:1,
                        owner:1,
                        created_at:"$createdAt",
                        updated_at:"$updatedAt"
                    }
                },
                { $skip: (page - 1) * limit },
                { $limit: limit }
            ]);
            const count = await Community.countDocuments();
            res.status(200).json({
                status:true,
                content:{
                    meta:{
                        total:count,
                        pages:Math.ceil(count/limit),
                        page
                    },
                    data:communities
                }
            });
        } catch (error) {
            res.status(500).json({
                status:false,
                error:error.message
            });
        }
    }

    static getJoinedCommunities = async(req,res) => {
        //get details of communities i am a member of and expand on owner of communities
        try {
            const id = req.data;
            const {limit=10,page=1} = req.query;
            const communities = await Community.aggregate([
                {
                    $lookup:{
                        from:"members",
                        localField:"_id",
                        foreignField:"community",
                        as:"members"
                    }
                },
                {
                    $unwind:"$members"
                },
                {
                    $match:{
                        "members.user":id
                    }
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner"
                    }
                },
                {
                    $unwind:"$owner"
                },
                {
                    $project:{
                        _id:1,
                        name:1,
                        slug:1,
                        owner:{
                            id:"$owner._id",
                            name:"$owner.name"
                        },
                        created_at:"$createdAt",
                        updated_at:"$updatedAt"
                    }
                },
                { $skip: (page - 1) * limit },
                { $limit: limit }
            ]);
            const count = await Community.countDocuments();
            res.status(200).json({
                status:true,
                content:{
                    meta:{
                        total:count,
                        pages:Math.ceil(count/limit),
                        page
                    },
                    data:communities
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