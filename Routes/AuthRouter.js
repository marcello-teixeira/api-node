import express from 'express';
import { authController } from '../Controllers/AuthController.js';

const route = express.Router();


// HTTP POST AUTH MEMBER
route.route('/login-member').post((req, res) => authController.loginMember(req, res));

export default route;

