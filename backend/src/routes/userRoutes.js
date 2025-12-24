import express from "express";

import { getProfile, searchUser, updateProfile, updateProfileImage } from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

router.put(
    "/profile-image",
    authMiddleware,
    updateProfileImage
);
router.get("/profile", authMiddleware, getProfile);
router.patch("/profile", authMiddleware, updateProfile);
router.get("/search", authMiddleware, searchUser);


export default router;