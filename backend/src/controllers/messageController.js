import Message from "../models/ChatMessage.js";
import { getIO } from "../websocket/index.js";
import { translateText } from "./../services/translation.service.js";
import { mysqlDB } from "./../config/mysql.js";


// export const sendMessage = async (req, res) => {
//     try {
//         const sender_id = req.user.id;
//         const { receiver_id, content, message_type, reply_to, scheduled_for } = req.body;
//         const chat_id =
//             sender_id < receiver_id
//                 ? `${sender_id}_${receiver_id}`
//                 : `${receiver_id}_${sender_id}`;

//         const isScheduled = scheduled_for && new Date(scheduled_for) > new Date();

//         const message = await Message.create({
//             chat_id,
//             sender_id,
//             receiver_id,
//             content,
//             message_type,
//             reply_to: reply_to || null,
//             scheduled_for: isScheduled ? new Date(scheduled_for) : null,
//             status: isScheduled ? "scheduled" : "sent", // Set status
//             is_encrypted: true
//         });

//         if (!isScheduled) {
//             const io = getIO();
//             io.to(receiver_id.toString()).emit("receive-message", message);
//         }

//         return res.status(201).json({
//             success: true,
//             data: message
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };


export const sendMessage = async (req, res) => {
    try {
        const sender_id = req.user.id;
        const { receiver_id, content, message_type, reply_to, scheduled_for } = req.body;

        const [users] = await mysqlDB.execute(
            "SELECT language FROM users WHERE id = ?",
            [receiver_id]
        );
        const targetLang = users[0]?.language || "en";

        let translatedContent = null;
        if (message_type === "text" && targetLang !== "en") {
            translatedContent = await translateText(content, targetLang);
        }

        const chat_id = sender_id < receiver_id
            ? `${sender_id}_${receiver_id}`
            : `${receiver_id}_${sender_id}`;

        const isScheduled = scheduled_for && new Date(scheduled_for) > new Date();

        const message = await Message.create({
            chat_id,
            sender_id,
            receiver_id,
            content,
            message_type,
            reply_to: reply_to || null,
            scheduled_for: isScheduled ? new Date(scheduled_for) : null,
            status: isScheduled ? "scheduled" : "sent",
            is_encrypted: true,

            translation: translatedContent ? {
                lang: targetLang,
                text: translatedContent
            } : null
        });

        if (!isScheduled) {
            const io = getIO();
            io.to(receiver_id.toString()).emit("receive-message", message);
        }

        return res.status(201).json({ success: true, data: message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const markAsRead = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { chat_id } = req.body;
        if (!chat_id) { return res.status(400).json({ message: "chat_id is required" }); }
        const result = await Message.updateMany(
            {
                chat_id,
                receiver_id: user_id,
                read_at: null
            },
            {
                read_at: new Date()
            }
        );
        return res.json({ success: true, updatedCount: result.modifiedCount });

    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};


export const changeLanguge = async (req, res) => {
    const { language } = req.body;
    await mysqlDB.execute("UPDATE users SET language = ? WHERE id = ?", [language, req.user.id]);
    res.json({ success: true });
}