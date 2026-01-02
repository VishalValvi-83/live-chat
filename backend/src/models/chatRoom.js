import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema({
    name: { type: String, required: false },
    isGroup: { type: Boolean, default: false },
    group_image: { type: String, default: "" },
    description: { type: String, default: "" },

    participants: [{ type: Number, required: true }],
    admins: [{ type: Number }],
    createdBy: { type: Number },

    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("ChatRoom", ChatRoomSchema);