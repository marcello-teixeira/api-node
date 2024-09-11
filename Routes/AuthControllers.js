import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Person from '../Models/Person.js';

const route = express.Router();


// HTTP POST AUTH PERSON
route.post('/login-person', async (req, res) => {
    
    const {username, password, mail} = req.body;

    if(!password) {
        res.status(400).json({msg: "password is not defined"})
        return;
    }

    if(!username && !mail) {
        res.status(400).json({msg: "mail and username are not defined"})
        return;
    }

    const user = await Person.findOne({$or: [{mail: mail}, {username: username}]});

    const passwordHash = await bcrypt.compare(password, user.password);

    if(!passwordHash) {
        res.status(401).json({msg: "Login failed"});
        return;
    }
      
    const secret = process.env.secret_token;

    const token = jwt.sign(
    {
        id: user.id
    },
        secret
    );

    res.status(200).json({token: token});    
});

export default route;

