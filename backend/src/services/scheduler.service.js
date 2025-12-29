import Message from "../models/ChatMessage.js";
import { getIO } from "../websocket/index.js";

export const initScheduler = () => {
    // Check every 30 seconds
    setInterval(async () => {
        try {
            const now = new Date();

            // Find messages that are scheduled AND due
            const dueMessages = await Message.find({
                status: "scheduled",
                scheduled_for: { $lte: now }
            });

            if (dueMessages.length === 0) return;

            console.log(`🚀 Sending ${dueMessages.length} scheduled messages...`);

            const io = getIO();

            for (const msg of dueMessages) {
                // 1. Emit to Receiver (if online)
                io.to(msg.receiver_id.toString()).emit("receive-message", msg);

                // 2. Emit to Sender (so their UI updates from "Clock" to "Tick")
                io.to(msg.sender_id.toString()).emit("message-sent", msg);

                // 3. Update DB
                msg.status = "sent";
                msg.scheduled_for = null; // Clear schedule
                await msg.save();
            }

        } catch (error) {
            console.error("Scheduler Error:", error);
        }
    }, 30000); // 30 seconds
};