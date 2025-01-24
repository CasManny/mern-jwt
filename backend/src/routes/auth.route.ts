import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshHandler,
  registerUser,
  verifyTokenHandler,
} from "../controllers/auth.controller";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/refresh", refreshHandler);
router.get("/email/verify/:code", verifyTokenHandler);

export default router;
