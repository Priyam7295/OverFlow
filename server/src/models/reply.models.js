import mongoose from "mongoose";
const { Schema } = mongoose;

const replySchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

export const Reply = mongoose.model("Reply", replySchema);
