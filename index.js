// Imports from project

import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';


// imports routes
import personController from './Routes/PersonController.js'
import authController from './Routes/AuthControllers.js'

dotenv.config();

const app = express();

// middlewares

app.use( 
    express.urlencoded({
        extends: true
    })
);

app.use(express.json());

app.use('/auth', authController);

app.use('/person', personController);


// Load connection_string environment variable
const uri = process.env.connection_string;

mongoose.connect(uri)
    .then(() => {
        console.log('Connected on database');
        app.listen(8080);
    })
    .catch((resp) => console.error(resp));

export default app;
