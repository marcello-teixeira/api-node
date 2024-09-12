// Imports from project

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './Routes/routes.js';


dotenv.config();

const app = express();

// middlewares

app.use(cors());

app.use(express.json());

app.use( 
    express.urlencoded({
        extends: true

    })
);

app.use('/', routes);

// database connection

import { connectionContext } from './db/connectionContext.js';

connectionContext();

app.listen(8080);

export default app;
