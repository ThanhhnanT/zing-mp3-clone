import { Router } from "express";
import * as controller from "../../controller/client/users.control"
import { upload as upCloud } from "../../middleware/upCloud";
import multer from "multer"
const upload = multer()
export const userRoute = Router()

userRoute.post('/login', controller.login)
userRoute.post ("/register", controller.register)
userRoute.get ("/infor", controller.infor)

userRoute.post("/createOTP", controller.sendOTP)
userRoute.post("/receiveOTP", controller.receiveOTP)
userRoute.patch("/resetPass", controller.resetPass)
userRoute.post("/upload-avatar", upload.single("avatar"), upCloud, controller.upAvatar)
userRoute.patch("/infor", controller.changeInfor)