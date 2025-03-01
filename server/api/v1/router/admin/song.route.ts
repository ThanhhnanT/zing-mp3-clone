import {Router} from "express"
import * as controller from "../../controller/admin/song.control"

export const songRoute= Router()

songRoute.get("/", controller.getSong)
songRoute.patch("/change-status", controller.changeStatus)