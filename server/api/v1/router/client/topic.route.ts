import { Router } from "express";
import * as controller from "../../controller/client/topic.control"
export const topicRouter = Router();

topicRouter.get("/", controller.getTopics);
topicRouter.get("/:slugSongTopic", controller.getSongTopics);