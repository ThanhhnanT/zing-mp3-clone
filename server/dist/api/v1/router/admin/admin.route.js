"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_route_1 = require("./account.route");
const song_route_1 = require("./song.route");
const AdminRouter = (app) => {
    app.use("/admin", account_route_1.accountRouter);
    app.use("/admin/song", song_route_1.songRoute);
};
exports.default = AdminRouter;
