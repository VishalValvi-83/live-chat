import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chat_id: {
            type: String,
            required: true
        },

        sender_id: {
            type: Number,
            required: true
        },

        receiver_id: {
            type: Number,
            required: false
        },

        message_type: {
            type: String,
            enum: ["text", "image", "video", "audio", "file"],
            default: "text"
        },

        content: {
            type: String,
            required: true
        },

        chat_alerts: {
            type: String,
            required: false
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
        },
        reply_to: {
            id: { type: String },
            content: { type: String },
            type: { type: String }
        },
        scheduled_for: {
            type: Date,
            default: null
        },
        status: {
            type: String,
            enum: ["sent", "delivered", "read", "scheduled"],
            default: "sent"
        },
        translation: {
            lang: { type: String },
            text: { type: String }
        }
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
