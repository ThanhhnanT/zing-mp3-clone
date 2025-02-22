import { Router } from "express";
import * as controller from "../../controller/client/users.control"

export const userRoute = Router()

userRoute.post('/login', controller.login)
userRoute.post ("/register", controller.register)

userRoute.post("/createOTP", controller.sendOTP)
userRoute.post("/receiveOTP", controller.receiveOTP)
userRoute.patch("/resetPass", controller.resetPass)