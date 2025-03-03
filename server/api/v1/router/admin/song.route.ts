import {Router} from "express"
import * as controller from "../../controller/admin/song.control"
import  {uploadFields}  from "../../../../config/storageCloud"
export const songRoute= Router()

songRoute.get("/", controller.getSong)
songRoute.patch("/change-status", controller.changeStatus)
songRoute.post("/create-song", uploadFields,controller.createSong)
songRoute.get("/singer", controller.getSinger)
songRoute.get("/topic", controller.getTopic)
songRoute.post('/create-song-2', controller.createSong2)