import { Router } from "express";
const router = Router();

// Import your controller functions
import {
  postMessage,
  getOneToOneMsg,
  getGroupMsg,
  postGroupMsg,
  MsgFromUnknown,
  unknownMsg,
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

// Route to recieve any message from unknown number
router.get("/user/chat/msg/unknown", authenticate, MsgFromUnknown);

router.get(
  "/user/chat/usknownMsg/msg/:userId/:conversationId",
  authenticate,
  unknownMsg
);

export default router;
