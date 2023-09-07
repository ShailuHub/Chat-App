import { Router } from "express";
const router = Router();
import {
  postSignup,
  getSignup,
  getLogin,
  postLogin,
} from "../controllers/user";

router.post("/user/signup", postSignup);
router.get("/user/signup", getSignup);
router.post("/user/login", postLogin);
router.get("/user/login", getLogin);

export default router;
