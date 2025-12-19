import express from "express";

import { updateProfileImage } from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

router.put(
    "/profile-image",
    authMiddleware,
    updateProfileImage
);

export default router;