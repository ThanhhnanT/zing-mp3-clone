import { Express } from "express";
import { accountRouter } from "./account.route";
import { songRoute } from "./song.route";
import { configRoute } from "./config.route";
const AdminRouter= (app: Express): void => {
    app.use("/admin", accountRouter)
    app.use("/admin/song", songRoute)
    app.use("/admin/config", configRoute)
}

export default AdminRouter