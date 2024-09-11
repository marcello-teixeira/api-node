import express from 'express'
import Person from '../Models/Person.js';
import bcrypt from 'bcrypt';
import { checkToken, getClaims } from '../Services/Token.js';

const router = express.Router();

// HTTP POST
router.post('/', async (req, res) => {

    const { name, username, mail, password } = req.body;
    
    if(Object.keys(req.body).length === 0){
        res.status(500).json({msg: "Some field doesn't have data"});
        return;
    }
    
    if(!name || !username || !mail || !password) {
        res.status(422).json({msg: "Some field doesn't have data"})
        return;
    }
    
    const is_mailRegistered = await Person.findOne({mail: mail});
    
    if(is_mailRegistered) {
        res.status(422).json({msg: "Mail is already registered"});
        return;
    }
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const person = new Person({
        name, 
        username,
        mail,
        password: passwordHash
    });

    try {
        await Person.create(person);
        res.status(201).json({message: "Successful on create person"});
    }
    catch(er) {
        console.error(er)
        res.status(500).json({message_error: "Server cannot create a person"});
    }
});

// HTTP GET
router.get('/', checkToken, async (req, res) => {
    try {
        const people = await Person.find({}, {password: 0});
        res.status(200).json(people);
    }
    catch(er) {
        console.error(er);
        res.status(500).json({message_error: "Server cannot find a person"});
    }
});

// HTTP DELETE
router.delete('/', checkToken, async (req, res) => {
    try {
        const decoded = getClaims(req);
        const person = await Person.findOne({_id: decoded.id});
    
        if(!person) {
            res.status(404).json({message_error: "Server cannot find the id"});
        }
     
        await Person.deleteOne({_id: decoded.id});
        res.status(200).json({message_success: "Person deleted"});
    }
    catch (er) {
        console.log(er);
    }
});

// HTTP PATCH
router.patch('/', checkToken, async (req, res) => {
    const { value, field } = req.body;

    if(!value || !field) {
        res.status(400).json({msg: 'Field or value is null'});
        return;
    }

    const decoded = getClaims(req);
    const person = await Person.findOne({_id: decoded.id});

    if(!person) {
        res.status(404).json({msg: "Person not find"});
        return;
    }

    // update mail
    if(field === 'mail') {
        await Person.updateOne({_id: decoded.id}, {$set: {mail: value}});
        return res.status(201).json({msg: "mail updated"})
    }
    // update password
    if(field === 'password') {
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(value, salt);

        await Person.updateOne({_id: decoded.id}, {$set: {password: passwordHash}});
        return res.status(201).json({msg: "password updated"})
    }
    // update name
    if(field === 'name') {
        await Person.updateOne({_id: decoded.id}, {$set: {name: value}});
        return res.status(201).json({msg: "name updated"})
    }
    // update username
    if(field === 'username') {
        await Person.updateOne({_id: decoded.id}, {$set: {username: value}});
        return res.status(201).json({msg: "username updated"})
    }
});

export default router;