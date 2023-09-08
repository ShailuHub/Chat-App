import { Router } from "express";
const router = Router();
import {
  postSignup,
  getSignup,
  getLogin,
  postLogin,
  getChatPage,
} from "../controllers/user";

import authenticate from "../middleware/authenticate";

router.post("/user/signup", postSignup);
router.get("/user/signup", getSignup);
router.post("/user/login", postLogin);
router.get("/user/login", getLogin);
router.get("/user/chat", getChatPage);

export default router;
