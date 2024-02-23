import { Router } from "express";
import {
  logiUser,
  updatePassword,
  loginUserUpdate,
  deletePassword,
  editPassword
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/api/auth/:userId").get(logiUser);
 
router.route("/api/login").post(loginUserUpdate);
router.route("/api/password-gen/:userId").post(updatePassword);
router.route("/api/password-delete/:deleteId/:deletedOne").delete(deletePassword)
router.route("/api/password-edit/:userId/:editId").post(editPassword)

export default router;
