import Message from "../models/ChatMessage.js";
import { mysqlDB } from "../config/mysql.js";
import chatRoom from "../models/chatRoom.js";

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

        // const messages = await Message.find({
        //     chat_id,
        //     $or: [
        //         { sender_id: currentUserId },
        //         { receiver_id: currentUserId }
        //     ]
        // })
        //     .sort({ createdAt: -1 }) 
        //     .skip(skip)              
        //     .limit(limit);          
        const messages = await Message.find({
            chat_id,
            $or: [
                { status: { $ne: "scheduled" } },
                {
                    status: "scheduled",
                    sender_id: currentUserId
                }
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

//31/12/25 14.40
// export const getChatList = async (req, res) => {
//     try {
//         const user_id = Number(req.user.id);

//         const chats = await Message.aggregate([
//             {
//                 $match: {
//                     $and: [
//                         {
//                             $or: [{ sender_id: user_id }, { receiver_id: user_id }]
//                         },
//                         {
//                             $or: [
//                                 { status: { $ne: "scheduled" } }, 
//                                 { sender_id: user_id }            
//                             ]
//                         }
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
//                     createdAt: { $first: "$createdAt" },
//                     unreadCount: {
//                         $sum: {
//                             $cond: [
//                                 {
//                                     $and: [
//                                         { $eq: ["$receiver_id", user_id] },
//                                         { $eq: ["$read_at", null] }
//                                     ]
//                                 },
//                                 1,
//                                 0
//                             ]
//                         }
//                     }
//                 }
//             }
//         ]);

//         const chatUserIds = [
//             ...new Set(
//                 chats
//                     .map(chat =>
//                         chat.sender_id === user_id
//                             ? chat.receiver_id
//                             : chat.sender_id
//                     )
//                     .filter(id => id !== user_id)
//             )
//         ];

//         if (!chatUserIds.length) {
//             return res.json({ success: true, data: [] });
//         }

//         const placeholders = chatUserIds.map(() => "?").join(",");

//         const [users] = await mysqlDB.execute(
//             `
//             SELECT id, full_name, email, phone, profile_image
//             FROM users
//             WHERE id IN (${placeholders})
//             `,
//             chatUserIds
//         );

//         const usersMap = {};
//         users.forEach(user => (usersMap[user.id] = user));

//         const finalChats = chats.map(chat => {
//             const otherUserId =
//                 chat.sender_id === user_id
//                     ? chat.receiver_id
//                     : chat.sender_id;

//             return {
//                 chat_id: chat._id,
//                 last_message: chat.last_message,
//                 message_type: chat.message_type,
//                 createdAt: chat.createdAt,
//                 user: usersMap[otherUserId] || null,
//                 unreadCount: chat.unreadCount
//             };
//         });

//         res.json({
//             success: true,
//             message: "Chat list fetched successfully",
//             data: finalChats
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

//02/01/2026 14.26
// export const getChatList = async (req, res) => {
//     try {
//         const user_id = Number(req.user.id);

//         const chats = await Message.aggregate([
//             {
//                 $match: {
//                     $and: [
//                         { $or: [{ sender_id: user_id }, { receiver_id: user_id }] },
//                         {
//                             $or: [
//                                 { status: { $ne: "scheduled" } },
//                                 { sender_id: user_id }
//                             ]
//                         }
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
//                     createdAt: { $first: "$createdAt" },

//                     status: {
//                         $first: {
//                             $cond: {
//                                 if: { $eq: ["$status", "scheduled"] },
//                                 then: "scheduled",
//                                 else: {
//                                     $cond: {
//                                         if: { $ne: ["$read_at", null] },
//                                         then: "read",
//                                         else: {
//                                             $cond: {
//                                                 if: { $ne: ["$delivered_at", null] },
//                                                 then: "delivered",
//                                                 else: "sent"
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     },

//                     unreadCount: {
//                         $sum: {
//                             $cond: [
//                                 {
//                                     $and: [
//                                         { $eq: ["$receiver_id", user_id] },
//                                         { $eq: ["$read_at", null] },
//                                         { $ne: ["$status", "scheduled"] }
//                                     ]
//                                 },
//                                 1,
//                                 0
//                             ]
//                         }
//                     }
//                 }
//             }
//         ]);

//         const chatUserIds = [
//             ...new Set(
//                 chats
//                     .map(chat =>
//                         chat.sender_id === user_id
//                             ? chat.receiver_id
//                             : chat.sender_id
//                     )
//                     .filter(id => id !== user_id)
//             )
//         ];

//         if (!chatUserIds.length) {
//             return res.json({ success: true, data: [] });
//         }

//         const placeholders = chatUserIds.map(() => "?").join(",");

//         const [users] = await mysqlDB.execute(
//             `SELECT id, full_name, email, phone, profile_image
//              FROM users
//              WHERE id IN (${placeholders})`,
//             chatUserIds
//         );

//         const usersMap = {};
//         users.forEach(user => (usersMap[user.id] = user));

//         const finalChats = chats.map(chat => {
//             const otherUserId =
//                 chat.sender_id === user_id
//                     ? chat.receiver_id
//                     : chat.sender_id;

//             return {
//                 chat_id: chat._id,
//                 last_message: chat.last_message,
//                 message_type: chat.message_type,
//                 status: chat.status,
//                 sender_id: chat.sender_id,
//                 createdAt: chat.createdAt,
//                 user: usersMap[otherUserId] || null,
//                 unreadCount: chat.unreadCount
//             };
//         });

//         res.json({
//             success: true,
//             message: "Chat list fetched successfully",
//             data: finalChats
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

export const getChatList = async (req, res) => {
    try {
        const user_id = Number(req.user.id);

        // 1. Fetch Groups I belong to
        const userGroups = await chatRoom.find({
            participants: { $in: [user_id] },
            isGroup: true
        });
        const groupIds = userGroups.map(g => g._id.toString());

        // 2. Aggregate Messages (DMs + Group Messages)
        const chats = await Message.aggregate([
            {
                $match: {
                    $or: [
                        // Logic for DMs
                        { sender_id: user_id },
                        { receiver_id: user_id },
                        // Logic for Groups (chat_id matches a Group ID)
                        { chat_id: { $in: groupIds } }
                    ]
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$chat_id",
                    last_message: { $first: "$content" },
                    message_type: { $first: "$message_type" },
                    status: { $first: "$status" },
                    sender_id: { $first: "$sender_id" },
                    createdAt: { $first: "$createdAt" },

                    // Count unread (different logic for groups could be added here)
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $ne: ["$sender_id", user_id] }, // Not my message
                                        { $eq: ["$read_at", null] }
                                    ]
                                }, 1, 0
                            ]
                        }
                    }
                }
            }
        ]);

        // 3. Map Results to "Display Objects"
        // We need to fetch User details for DMs, but use Group details for Groups.

        // Find DMs (chat_id looks like "1_2")
        const dmChatIds = chats.filter(c => c._id.includes("_"));
        const dmUserIds = [...new Set(dmChatIds.map(c => {
            const [u1, u2] = c._id.split("_");
            return Number(u1) === user_id ? Number(u2) : Number(u1);
        }))];

        // Fetch DM Users from MySQL
        let usersMap = {};
        if (dmUserIds.length > 0) {
            const [users] = await mysqlDB.execute(
                `SELECT id, full_name, profile_image, email FROM users WHERE id IN (${dmUserIds.join(",")})`
            );
            users.forEach(u => usersMap[u.id] = u);
        }

        // Map Groups for easy lookup
        const groupsMap = {};
        userGroups.forEach(g => groupsMap[g._id.toString()] = g);

        const finalChats = chats.map(chat => {
            const isGroup = !chat._id.includes("_"); // Simple check: Groups use MongoIDs, DMs use "_"

            if (isGroup) {
                const group = groupsMap[chat._id];
                return {
                    chat_id: chat._id,
                    isGroup: true,
                    name: group?.name || "Unknown Group",
                    image: group?.group_image,
                    status: chat.status,
                    sender_id: chat.sender_id,
                    last_message: chat.last_message,
                    createdAt: chat.createdAt,
                    unreadCount: chat.unreadCount
                };
            } else {
                // It is a DM
                const [u1, u2] = chat._id.split("_");
                const otherId = Number(u1) === user_id ? Number(u2) : Number(u1);
                const user = usersMap[otherId];

                return {
                    chat_id: chat._id,
                    isGroup: false,
                    user: user,
                    name: user?.full_name || "User",
                    image: user?.profile_image,
                    sender_id: chat.sender_id,
                    status: chat.status,
                    message_type: chat.message_type,
                    last_message: chat.last_message,
                    createdAt: chat.createdAt,
                    unreadCount: chat.unreadCount
                };
            }
        });

        res.json({ success: true, data: finalChats });

    } catch (error) {
        console.error("here your error is ", error);
        res.status(500).json({ message: "Internal server error", error: error.sqlMessage });
    }
};


export const createGroup = async (req, res) => {
    try {
        const { name, participants, group_image } = req.body;
        const currentUserId = req.user.id;

        if (!name || !participants || participants.length === 0) {
            return res.status(400).json({ message: "Group name and participants are required" });
        }

        // Add creator to participants if not already there
        const allParticipants = [...new Set([...participants, currentUserId])];

        const newGroup = await chatRoom.create({
            name,
            isGroup: true,
            group_image: group_image || "", // You can use a default image URL here
            participants: allParticipants,
            admins: [currentUserId],
            createdBy: currentUserId
        });

        res.status(201).json({
            success: true,
            message: "Group created successfully",
            data: newGroup
        });

    } catch (error) {
        console.error("Create Group Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};