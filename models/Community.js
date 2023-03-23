import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";
import slugify from "slugify";
const {Schema} = mongoose;

const CommunitySchema = new Schema({
    _id: {
        type: String,
        default: Snowflake.generate()
    },
    name: {
        type: String,
        required: true
    },
    slug:{
        type: String,
        unique:true
    },
    owner: {
        type: String,
        ref: "User"
    },
    
},{timestamps:true});

CommunitySchema.pre("save", function(next){
    const community = this;
    if(community.isNew){
        community.slug = slugify(community.name, {lower:true});
    }
    next();
})

export default mongoose.model("Community", CommunitySchema);