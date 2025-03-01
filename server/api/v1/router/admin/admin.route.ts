import { Express } from "express";
import { accountRouter } from "./account.route";
import { songRoute } from "./song.route";
const AdminRouter= (app: Express): void => {
    app.use("/admin", accountRouter)
    app.use("/admin/song", songRoute)
}

export default AdminRouter