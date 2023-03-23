import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {Snowflake} from '@theinternetfolks/snowflake'
const {Schema} = mongoose;

const UserSchema = new Schema({
    _id: {
        type: String,
        default: Snowflake.generate()
    },
    name: {
        type: String,
        trim:true,
        minLength:[2,'Minimum name length should be 2']
    },
    email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength:[6,'Minimum password length should be 6']
    },
},{timestamps:true});

UserSchema.pre('save', async function(next){
    const user= this;
    if(user.isModified('password')){
        try {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        } catch (error) {
            return next(error);
        }
    } 
    next();
});

UserSchema.methods.comparePassword = async function(password){
    const user = this;
    try {
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch;
    } catch (error) {
        return next(error);
    }
}

export default mongoose.model("User", UserSchema);