import { Router } from "express";
import authenticate from "../middleware/authenticate";
const router = Router();
import { postGroup, postMember, getGroup } from "../controllers/group";

router.post("/user/create/group/:groupName", authenticate, postGroup);
router.post("/user/create/group", authenticate, postMember);
router.get("/user/get/group", authenticate, getGroup);

export default router;
