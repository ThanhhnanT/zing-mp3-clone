import {Router} from "express"
import * as controller from "../../controller/client/search.control"
export const searchRouter = Router()

searchRouter.post("/song", controller.search)