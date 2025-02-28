import { Router } from "express";
import * as controller from "../../controller/client/songs.control";
export const songRouter = Router();

songRouter.get("/get/:slugSong", controller.getSongs);
songRouter.patch("/add-listen", controller.addListen);
songRouter.get("/find-top", controller.getTop3)
