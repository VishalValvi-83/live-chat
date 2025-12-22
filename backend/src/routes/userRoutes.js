import express from "express";

import { updateProfile, updateProfileImage } from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

router.put(
    "/profile-image",
    authMiddleware,
    updateProfileImage
);
router.patch("/profile", authMiddleware, updateProfile);
export default router;