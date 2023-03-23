import mongoose from "mongoose";
import {Snowflake} from '@theinternetfolks/snowflake'
const {Schema} = mongoose;

const MemberSchema = new Schema({
    _id: {
        type: String,
        default: Snowflake.generate()
    },
    community:{
        type: String,
        required: true,
        ref: "Community"
    },
    user:{
        type: String,
        required: true,
        ref: "User"
    },
    role:{
        type: String,
        required: true,
        ref: "Role"
    },
},{timestamps:true});

export default mongoose.model("Member", MemberSchema);