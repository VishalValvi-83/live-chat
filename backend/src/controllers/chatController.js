import Message from "../models/ChatMessage.js";
import { mysqlDB } from "../config/mysql.js";

// 30/12/2025 10:53
// export const getChat = async (req, res) => {
//     try {
//         const { chat_id } = req.params;

//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 20;
//         const skip = (page - 1) * limit;

//         const messages = await Message.find({ chat_id })
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         const reversedMessages = messages.reverse();

//         res.status(200).json({
//             success: true,
//             data: reversedMessages,

//             hasMore: messages.length === limit,
//             page: page
//         });
//     } catch (err) {
//         res.status(500).json({ message: "Server error" });
//     }
// };

// export const getChatList = async (req, res) => {
//     try {
//         const user_id = Number(req.user.id);
//         const messages = await Message.find({
//             $or: [
//                 { sender_id: user_id },
//                 { receiver_id: user_id }
//             ]
//         });
//         console.log(messages);
//         res.json(messages);

//         const chats = await Message.aggregate([
//             {
//                 $match: {
//                     $or: [
//                         { sender_id: user_id },
//                         { receiver_id: user_id },
//                         { sender_id: String(user_id) },
//                         { receiver_id: String(user_id) }
//                     ]
//                 }
//             },
//             {
//                 $sort: { createdAt: -1 }
//             },
//             {
//                 $group: {
//                     _id: "$chat_id",
//                     last_message: { $first: "$content" },
//                     message_type: { $first: "$message_type" },
//                     sender_id: { $first: "$sender_id" },
//                     receiver_id: { $first: "$receiver_id" },
//                     createdAt: { $first: "$createdAt" }
//                 }
//             }
//         ]);

//         res.status(200).json({
//             success: true,
//             data: chats
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

//17:50 PM
// export const getChatList = async (req, res) => {
//     try {
//         const user_id = Number(req.user.id);
//         const messages = await Message.find({
//             $or: [
//                 { sender_id: user_id },
//                 { receiver_id: user_id }
//             ]
//         });

//         const chats = await Message.aggregate([
//             {
//                 $match: {
//                     $or: [
//                         { sender_id: user_id },
//                         { receiver_id: user_id }
//                     ]
//                 }
//             },
//             { $sort: { createdAt: -1 } },
//             {
//                 $group: {
//                     _id: "$chat_id",
//                     last_message: { $first: "$content" },
//                     message_type: { $first: "$message_type" },
//                     sender_id: { $first: "$sender_id" },
//                     receiver_id: { $first: "$receiver_id" },
//                     createdAt: { $first: "$createdAt" }
//                 }
//             }
//         ]);
//         res.status(200).json({
//             success: true,
//             data: chats
//         });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

export const getChat = async (req, res) => {
    try {
        const { chat_id } = req.params;
        const currentUserId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const messages = await Message.find({
            chat_id,
            $or: [
                { sender_id: currentUserId },
                { receiver_id: currentUserId }
            ]
        })
            .sort({ createdAt: -1 }) 
            .skip(skip)              
            .limit(limit);          

        const reversedMessages = messages.reverse();

        const hasMore = messages.length === limit;

        res.status(200).json({
            success: true,
            data: reversedMessages,
            hasMore,
            page
        });

    } catch (err) {
        console.error("GetChat Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getChatList = async (req, res) => {
    try {
        const user_id = Number(req.user.id);

        const chats = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender_id: user_id }, { receiver_id: user_id }]
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$chat_id",
                    last_message: { $first: "$content" },
                    message_type: { $first: "$message_type" },
                    sender_id: { $first: "$sender_id" },
                    receiver_id: { $first: "$receiver_id" },
                    createdAt: { $first: "$createdAt" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$receiver_id", user_id] },
                                        { $eq: ["$read_at", null] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const chatUserIds = [
            ...new Set(
                chats
                    .map(chat =>
                        chat.sender_id === user_id
                            ? chat.receiver_id
                            : chat.sender_id
                    )
                    .filter(id => id !== user_id)
            )
        ];

        if (!chatUserIds.length) {
            return res.json({ success: true, data: [] });
        }

        const placeholders = chatUserIds.map(() => "?").join(",");

        const [users] = await mysqlDB.execute(
            `
            SELECT id, full_name, email, phone, profile_image
            FROM users
            WHERE id IN (${placeholders})
            `,
            chatUserIds
        );

        const usersMap = {};
        users.forEach(user => (usersMap[user.id] = user));

        const finalChats = chats.map(chat => {
            const otherUserId =
                chat.sender_id === user_id
                    ? chat.receiver_id
                    : chat.sender_id;

            return {
                chat_id: chat._id,
                last_message: chat.last_message,
                message_type: chat.message_type,
                createdAt: chat.createdAt,
                user: usersMap[otherUserId] || null,
                unreadCount: chat.unreadCount
            };
        });

        res.json({
            success: true,
            message: "Chat list fetched successfully",
            data: finalChats
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
