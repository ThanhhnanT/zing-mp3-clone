import express from 'express';
import {Express} from 'express';
import 'dotenv/config';
import * as database from './config/database';
import * as bodyParser from 'body-parser'
import Router from './api/v1/router/client/client.route';
import cors from 'cors'

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;
app.use(cors({
    origin: "http://localhost:5173",  
    credentials: true                
}));
// Connect database
database.connect();

// body-parser
app.use(bodyParser.json())
// Router
Router(app);
app.listen(port, ()=> {
    console.log(`On port: ${port}`)
})