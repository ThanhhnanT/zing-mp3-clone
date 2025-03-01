import { Router } from "express";
import * as controller from "../../controller/admin/account.control"
export const accountRouter = Router()

accountRouter.post("/setLogin", controller.login )