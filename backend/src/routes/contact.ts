import { Router } from "express";
import authenticate from "../middleware/authenticate";
import {
  getAddContactPage,
  createNewContact,
  deleteContact,
  getAddToContactPage,
} from "../controllers/contact";
const router = Router();

router.get("/user/addUser", getAddContactPage);
router.get("/user/toContact", getAddToContactPage);
router.post("/user/createContact", authenticate, createNewContact);
router.delete(
  "/user/delete/contact/:phone/:user2_id",
  authenticate,
  deleteContact
);

export default router;
