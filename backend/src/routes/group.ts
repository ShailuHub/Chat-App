import { Router } from "express";
import authenticate from "../middleware/authenticate";
const router = Router();
import {
  postGroup,
  postMember,
  getGroup,
  getGroupMember,
  getGroupChatPage,
  makeAdmin,
  removeAdmin,
  deleteGroup,
} from "../controllers/group";

router.post("/user/create/group/:groupName", authenticate, postGroup);
router.post("/user/create/group", authenticate, postMember);
router.get("/user/get/group", authenticate, getGroup);
router.get("/user/get/group/:groupId", authenticate, getGroupMember);
router.get("/user/group", getGroupChatPage);
router.patch("/user/make/admin/:userId", authenticate, makeAdmin);
router.patch("/user/remove/admin/:userId", authenticate, removeAdmin);
router.delete("/user/delete/group/:groupId", authenticate, deleteGroup);

export default router;
