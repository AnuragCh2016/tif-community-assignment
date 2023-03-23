import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";
const { Schema } = mongoose;

const RoleSchema = new Schema({
    _id: {
        type: String,
        default: Snowflake.generate(),
    },
    name: {
        type: String,
        required: true,     
        minLength: [2, "Name should be atleast 2 characters"],
    },
    scopes: [{
        type: String,
    }],
}, { timestamps: true });

RoleSchema.pre("validate", function (next) {
    const role = this;
    if (role.isNew) {
        // Set scopes only when creating a new document
        if (role.name === "Community Admin") {
            role.scopes = ["member-get", "member-add", "member-remove"];
        } else if (role.name === "Community Moderator") {
            role.scopes = ["member-get", "member-remove"];
        } else if (role.name === "Community Member") {
            role.scopes = ["member-get"];
        }
    }
    next();
});

export default mongoose.model("Role", RoleSchema);
