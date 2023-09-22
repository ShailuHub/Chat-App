import { Router } from "express";
import authenticate from "../middleware/authenticate";
import {
  getAddContactPage,
  createNewContact,
  deleteContact,
  getAddToContactPage,
  getSearchOrAdd,
  getGroupExcludedList,
} from "../controllers/contact";
const router = Router();

router.get("/user/addUser", getAddContactPage);
router.get("/user/searchOrAdd", getSearchOrAdd);
router.get(
  "/user/remaining/chat/list/:groupId",
  authenticate,
  getGroupExcludedList
);
router.get("/user/toContact", getAddToContactPage);
router.post("/user/createContact", authenticate, createNewContact);
router.delete(
  "/user/delete/contact/:phone/:user2_id",
  authenticate,
  deleteContact
);

export default router;
