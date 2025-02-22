import { Router } from "express";
import { getSongs } from "../../controller/client/songs.control";
export const songRouter = Router();

songRouter.get("/:slugSong", getSongs);

