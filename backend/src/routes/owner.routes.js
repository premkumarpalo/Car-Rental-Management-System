import Router from "express"
import { registerUser,loginUser, updateProfile, updateAccountDetails, updatePassword, logoutUser, fetchProfile } from "../controllers/owner.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import {verifyJWT} from "../middleware/auth.middleware.js"
const router = Router()
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/updateProfile").patch(verifyJWT,upload.single("profile"),updateProfile)
router.route("/updateAccount").patch(verifyJWT,updateAccountDetails)
router.route("/updatePassword").patch(verifyJWT,updatePassword)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/profile").get(verifyJWT,fetchProfile)
export default router