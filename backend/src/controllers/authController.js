import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { mysqlDB } from "../config/mysql.js";

export const register = async (req, res) => {
    try {
        const { username, full_name, email, phone, password } = req.body;

        // check existing user
        const [user] = await mysqlDB.query(
            "SELECT id FROM users WHERE email = ? OR username = ?",
            [email, username]
        );

        if (user.length > 0) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await mysqlDB.query(
            "INSERT INTO users (username, full_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)",
            [username, full_name, email, phone, hashedPassword]
        );

        res.json({ message: "User registered successfully!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await mysqlDB.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.status(400).json({success: false, message: "Invalid email or password" });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Login successful", data: user , token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
