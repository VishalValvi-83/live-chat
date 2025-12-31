import Message from "../models/ChatMessage.js";
import { getIO } from "../websocket/index.js";

export const initScheduler = () => {
    setInterval(async () => {
        try {
            const now = new Date();

            const dueMessages = await Message.find({
                status: "scheduled",
                scheduled_for: { $lte: now }
            });

            if (dueMessages.length === 0) return;

            console.log(`🚀 Sending ${dueMessages.length} scheduled messages...`);

            const io = getIO();

            for (const msg of dueMessages) {
                io.to(msg.receiver_id.toString()).emit("receive-message", msg);

                io.to(msg.sender_id.toString()).emit("message-status-update", {
                    message_id: msg._id,
                    status: "sent",
                    chat_id: msg.chat_id
                });


                msg.status = "sent";
                msg.scheduled_for = null;
                await msg.save();
            }

        } catch (error) {
            console.error("Scheduler Error:", error);
        }
    }, 30000);
};