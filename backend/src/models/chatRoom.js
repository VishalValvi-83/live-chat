import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
    participants: [{ type: Number, required: true }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
    