import { Router } from "express";
const router = Router();
import { postSignup, getSignup, getLogin } from "../controllers/user";

router.post("/user/signup", postSignup);
router.get("/user/signup", getSignup);
router.get("/user/login", getLogin);

export default router;
