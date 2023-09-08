import { Router } from "express";
const router = Router();
import { postMessage } from "../controllers/message";

import authenticate from "../middleware/authenticate";

router.post("/user/chat", authenticate, postMessage);

export default router;
