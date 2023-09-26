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
  getPrivateChat,
  getGroupPrivateChat,
  postUploadFile,
  postGroupUploadFile,
} from "../controllers/message";

// Import your authentication middleware
import authenticate from "../middleware/authenticate";
import { upload } from "../middleware/multerConfiguration";

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
router.get("/user/privateChat", getPrivateChat);
router.get("/group/privateChat", getGroupPrivateChat);
router.get(
  "/user/chat/usknownMsg/msg/:userId/:conversationId",
  authenticate,
  unknownMsg
);

router.post(
  "/user/uploadFile/:user2_id",
  authenticate,
  upload.array("files"),
  postUploadFile
);

router.post(
  "/user/uploadFile/group/:groupId",
  authenticate,
  upload.array("files"),
  postGroupUploadFile
);

export default router;
