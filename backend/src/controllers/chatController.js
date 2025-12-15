import Message from "../models/ChatMessage.js";

export const getChat = async (req, res) => {
    try {
        const { chat_id } = req.params;

        const messages = await Message.find({ chat_id })
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

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


export const getChatList = async (req, res) => {
    try {
        const user_id = Number(req.user.id);
        const messages = await Message.find({
            $or: [
                { sender_id: user_id },
                { receiver_id: user_id }
            ]
        });

        const chats = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender_id: user_id },
                        { receiver_id: user_id }
                    ]
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
                    createdAt: { $first: "$createdAt" }
                }
            }
        ]);
        res.status(200).json({
            success: true,
            data: chats
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};