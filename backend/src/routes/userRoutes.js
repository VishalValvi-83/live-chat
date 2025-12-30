import express from "express";

import { getProfile, searchUser, updateProfile, updateProfileImage } from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/auth.js';
import { changeLanguge } from "../controllers/messageController.js";
const router = express.Router();

router.put(
    "/profile-image",
    authMiddleware,
    updateProfileImage
);
router.get("/profile", authMiddleware, getProfile);
router.post("/profile", authMiddleware, getProfile)
router.patch("/profile", authMiddleware, updateProfile);
router.get("/search", authMiddleware, searchUser);
router.put("/language", authMiddleware, changeLanguge);

export default router;