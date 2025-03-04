"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_route_1 = require("./topic.route");
const songs_route_1 = require("./songs.route");
const users_route_1 = require("./users.route");
const search_route_1 = require("./search.route");
const Router = (app) => {
    app.use("/topics", topic_route_1.topicRouter);
    app.use("/songs", songs_route_1.songRouter);
    app.use('/users', users_route_1.userRoute);
    app.use('/search', search_route_1.searchRouter);
};
exports.default = Router;
