import { mysqlDB } from "../config/mysql.js";


export const updateProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profile_image } = req.body;

        if (!profile_image) {
            return res.status(400).json({ message: "Profile image URL required" });
        }

        await mysqlDB.query(
            "UPDATE users SET profile_image = ? WHERE id = ?",
            [profile_image, userId]
        );

        res.json({
            success: true,
            message: "Profile image updated",
            profile_image
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
