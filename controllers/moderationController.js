import Member from "../models/Member.js";
import Role from "../models/Role.js";
import Community from "../models/Community.js";
import User from "../models/User.js";
import { generateErrCode } from "../utils/generateErrorCode.js";
import { validationResult } from "express-validator";

export class ModerationController {
    static addMember = async(req,res) => {
        //only user whose role is Community Admin can add member
        try {
            const id = req.data;
            //have to make sure loggedInUser is Community Admin of community trying to add members to
            const {community, user, role} = req.body;
            //check if all three details are provided
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
            const checkCommunity = await Community.findOne({_id:community});
            if(checkCommunity.owner!==id){
                return res.status(403).json({
                    "status": false,
                    "errors": [
                      {
                        "message": "You are not authorized to perform this action.",
                        "code": "NOT_ALLOWED_ACCESS"
                      }
                    ]
                  });
            }
            const member = await Member.create({
                community,
                user,
                role
            });
            res.status(201).json({
                status:true,
                content:{
                    data:{
                        id:member._id,
                        community:member.community,
                        user:member.user,
                        role:member.role,
                        created_at:member.createdAt,
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

    static removeMember = async(req,res) => {
        //only user whose role is Community Admin or Community Moderator can remove member
        //i need community id in req.body, member id is passed as parameter
        try {
            const id = req.data;    //this id is user id of logged in user
            const {id:memberId} = req.params;
            const checkMember = await Member.findOne({_id:memberId});
            //since member contains: _id, userId, communityId and roleId
            //no need to specify which community i want to remove from
    
            //check if loggedInUser is Community Admin or Community Moderator or if 
            const loggedMember = await Member.findOne({user:id, community:checkMember.community}).populate('role');
            if(!checkMember){
                res.status(404).json({
                    "status": false,
                    "errors": [
                      {
                        "message": "Member not found.",
                        "code": "RESOURCE_NOT_FOUND"
                      }
                    ]
                  });
            } else if(!loggedMember||loggedMember.role.name==="Community Member") {
                res.status(403).json({
                    status:false,
                    "errors": [
                        {
                          "message": "You are not authorized to perform this action.",
                          "code": "NOT_ALLOWED_ACCESS"
                        }
                      ]
                });
            } else {
                const memberToDelete = await Member.findOneAndDelete({_id:memberId});
                res.status(200).json({
                    status:true,
                });
            }
        } catch (error) {
            res.status(500).json({
                status:false,
                error:error.message
            });
        }
    }
}