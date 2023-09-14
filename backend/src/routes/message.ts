import { Router } from "express";
const router = Router();

// Import your controller functions
import {
  postMessage,
  getOneToOneMsg,
  getGroupMsg,
  postGroupMsg,
} from "../controllers/message";

// Import your authentication middleware
import authenticate from "../middleware/authenticate";

// Define routes with comments
// Route to send a one-to-one message
router.post("/user/chat/oneToOne/msg/:user2_id", authenticate, postMessage);

// Route to retrieve one-to-one messages
router.get("/user/chat/oneToOne/msg/:user2_id", authenticate, getOneToOneMsg);

// Route to retrieve group messages
router.get("/user/chat/group/msg/:groupId", authenticate, getGroupMsg);

// Route to send a group message
router.post("/user/chat/group/msg/:groupId", authenticate, postGroupMsg);

export default router;
