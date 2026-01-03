import express from "express"
import { authMiddleware } from './../middleware/auth.js'
import { addGroupMember, createGroup, getChat, getChatList, getGroupDetails, removeGroupMember } from "../controllers/chatController.js";
import Message from "../models/ChatMessage.js";
import { markAsRead, sendMessage } from "../controllers/messageController.js";
const router = express.Router();

router.get("/list", authMiddleware, getChatList);
router.get("/:chat_id", authMiddleware, getChat);
router.post("/read/:chat_id", authMiddleware, async (req, res) => {
    await Message.updateMany(
        {
            chat_id: req.params.chat_id,
            receiver_id: req.user.id,
            read_at: null
        },
        { read_at: new Date() }
    );

    res.json({ success: true });
});

router.post("/send", authMiddleware, sendMessage);
router.post("/read", authMiddleware, markAsRead);
router.post("/group/create", authMiddleware, createGroup);
router.get("/group/:groupId", authMiddleware, getGroupDetails);
router.post("/group/add-member", authMiddleware, addGroupMember);
router.post("/group/remove-member", authMiddleware, removeGroupMember);

export default router;