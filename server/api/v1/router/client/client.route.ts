import {topicRouter} from './topic.route';
import { songRouter } from './songs.route';
import { userRoute } from './users.route';
import {Express} from 'express';
const Router = (app: Express):void => {
    app.use("/topics", topicRouter)
    app.use("/songs", songRouter)
    app.use('/users', userRoute)
}

export default Router;
