import express from 'express';
import {Express} from 'express';
import 'dotenv/config';
import * as database from './config/database';
import * as bodyParser from 'body-parser'
import Router from './api/v1/router/client/client.route';
import cors from 'cors'
import cookieParser from "cookie-parser"
import AdminRouter from './api/v1/router/admin/admin.route';

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
// Connect database
database.connect();

// body-parser
app.use(bodyParser.json())
app.use(cookieParser())
// Router
AdminRouter(app)
Router(app);
app.listen(port, ()=> {
    console.log(`On port: ${port}`)
})

export default app;