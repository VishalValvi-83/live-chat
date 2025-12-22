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

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const { full_name, phone, profile_image, username, email } = req.body;

        const updates = {};

        if (full_name !== undefined) {
            if (!full_name || typeof full_name !== 'string' || full_name.trim() === "") {
                return res.status(400).json({ message: "Full name cannot be empty" });
            }
            updates.full_name = full_name;
        }

        if (username !== undefined) {
            if (typeof username !== 'string' || username.trim() === "") {
                return res.status(400).json({ message: "Username cannot be empty" });
            }
            updates.username = username;
        }

        if (email !== undefined) {
            if (typeof email !== 'string' || email.trim() === "") {
                return res.status(400).json({ message: "Email cannot be empty" });
            }
            updates.email = email;
        }

        if (phone !== undefined) updates.phone = phone;
        if (profile_image !== undefined) updates.profile_image = profile_image;

        const keys = Object.keys(updates);
        if (keys.length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            });
        }

        const setClause = keys.map(key => `${key} = ?`).join(", ");
        const values = Object.values(updates);
        values.push(userId);

        const updateQuery = `UPDATE users SET ${setClause} WHERE id = ?`;

        try {
            const [result] = await mysqlDB.execute(updateQuery, values);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "User not found" });
            }

        } catch (dbError) {
            if (dbError.code === 'ER_DUP_ENTRY') {
                if (dbError.message.includes('username')) {
                    return res.status(409).json({ message: "Username already taken" });
                }
                if (dbError.message.includes('email')) {
                    return res.status(409).json({ message: "Email already registered" });
                }
            }

            throw dbError;
        }


        const [rows] = await mysqlDB.execute(
            `SELECT id, username, full_name, email, phone, profile_image 
            FROM users WHERE id = ?`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: rows[0]
        });

    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
