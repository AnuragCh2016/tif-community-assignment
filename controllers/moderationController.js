import Member from "../models/Member.js";
import Role from "../models/Role.js";
import Community from "../models/Community.js";
import User from "../models/User.js";

export class ModerationController {
    static addMember = async(req,res) => {
        //only user whose role is Community Admin can add member
        try {
            const id = req.data;
            //have to make sure loggedInUser is Community Admin of community trying to add members to
            const {community, user, role} = req.body;
            //check if all three details are provided
            if(!community||!user||!role){
                return res.status(400).json({
                    status:false,
                    error:"Please provide all details"
                });
            }

            //check if community exists and if loggedInUser is Community Admin
            const checkCommunity = await Community.findOne({_id:community});
            const checkUser = await User.findOne({_id:user});
            const checkRole = await Role.findOne({_id:role});
            if(!checkCommunity||!checkUser||!checkRole){
                return res.status(404).json({
                    status:false,
                    error:"Incorrect details"
                });
            } else if(checkCommunity.owner!==id){
                return res.status(403).json({
                    status:false,
                    error:"NOT_ALLOWED_ACCESS"
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
                    status:false,
                    error:"Incorrect details"
                });
            } else if(!loggedMember||loggedMember.role.name==="Community Member") {
                res.status(403).json({
                    status:false,
                    error:"NOT_ALLOWED_ACCESS"
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