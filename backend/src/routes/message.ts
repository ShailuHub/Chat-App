import { Router } from "express";
const router = Router();
import { postMessage, getMessage } from "../controllers/message";

import authenticate from "../middleware/authenticate";

router.post("/user/chat", authenticate, postMessage);
router.get("/user/chat/msg", authenticate, getMessage);

export default router;
