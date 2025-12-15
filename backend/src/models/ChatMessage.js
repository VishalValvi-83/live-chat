import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chat_id: {
            type: String,    // can be "user1-user2" or group_id
            required: true
        },

        sender_id: {
            type: Number,    // matches MySQL users.id
            required: true
        },

        receiver_id: {
            type: Number,    // matches MySQL users.id
            required: true
        },

        message_type: {
            type: String,
            enum: ["text", "image", "video", "audio", "file"],
            default: "text"
        },

        content: {
            type: String,   // encrypted text or uploaded file URL
            required: true
        },

        is_encrypted: {
            type: Boolean,
            default: true
        },

        delivered_at: {
            type: Date,
            default: null
        },

        read_at: {
            type: Date,
            default: null
        }
    },
    { timestamps: true } // createdAt, updatedAt automatically added
);

export default mongoose.model("Message", messageSchema);
