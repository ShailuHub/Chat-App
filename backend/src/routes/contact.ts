import { Router } from "express";
import authenticate from "../middleware/authenticate";
import {
  getAddContactPage,
  createNewContact,
  deleteContact,
} from "../controllers/contact";
const router = Router();

router.get("/user/addUser", getAddContactPage);
router.post("/user/createContact", authenticate, createNewContact);
router.delete(
  "/user/delete/contact/:phone/:user2_id",
  authenticate,
  deleteContact
);

export default router;
