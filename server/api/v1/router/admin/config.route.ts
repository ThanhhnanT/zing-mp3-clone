import { Router } from "express";
import * as controller from "../../controller/admin/config.control"

export const configRoute = Router()

configRoute.post("/set", controller.setConfig)
configRoute.get("", controller.getConfig)