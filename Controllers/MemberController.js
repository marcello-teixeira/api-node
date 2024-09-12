import { memberModel } from '../Models/Member.js';
import { getClaims } from '../Services/Token.js';
import { createAndPutMember } from '../Repository/CreateAndPut.js'
import bcrypt from 'bcrypt';

export const memberController = {
    //
    // HTTP POST ADD MEMBER
    //
    createMember: async(req, res) => {
        try {
            const member = await createAndPutMember(req, res);

            if(!member) {
               throw new Error("Can't create a member");
            }

            await memberModel.create(member);
            res.status(201).json({message: "Successful on create member"});
        }
        catch(er) {
            console.error(er)
            res.status(500).json({message_error: "Server cannot create a member"});
        }
    },
    //
    // HTTP GET ALL MEMBERS
    //
    getAllMembers: async(_, res) => {
        try {
            const people = await memberModel.find({}, { password: 0, profilePicure: 0 });
            res.status(200).json(people);
        }
        catch(er) {
            console.error(er);
            res.status(500).json({message_error: "Server cannot find a member"});
        }
    },
    //
    // HTTP GET PHOTO MEMBER
    //
    //
    getPictureMember: async (req, res) => {
        const claims = getClaims(req);

        const member = await memberModel.findOne({_id: claims.id});

        if(!member.profilePicure) {
            res.status(404).json({msg: 'Image not found'})
            return;
        }
        
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(member.profilePicure);
    },
    // HTTP DELETE MEMBER
    //
    deleteMember: async(req, res) => {
        try {
            const claims = getClaims(req);
            const member = await memberModel.findOne({_id: claims.id});
        
            if(!member) {
                res.status(404).json({message_error: "Server cannot find the id"});
            }
         
            await memberModel.deleteOne({_id: claims.id});
            res.status(200).json({message_success: "member deleted"});
        }
        catch (er) {
            console.log(er);
        }
    },
    //
    //  HTTP PATCH
    //
    patchMember: async(req, res) => {
        const { value, field } = req.body;

        if(!value || !field) {
            res.status(400).json({msg: 'Field or value is null'});
            return;
        }
    
        const claims = getClaims(req);
        const member = await memberModel.findOne({_id: claims.id});
    
        if(!member) {
            res.status(404).json({msg: "memberModel not find"});
            return;
        }
    
        // patch mail
        if(field === 'mail') {
            await memberModel.updateOne({_id: decoded.id}, {$set: {mail: value}});
            return res.status(201).json({msg: "mail updated"})
        }
        // patch password
        if(field === 'password') {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(value, salt);
    
            await memberModel.updateOne({_id: decoded.id}, {$set: {password: passwordHash}});
            return res.status(201).json({msg: "password updated"})
        }
        // patch name
        if(field === 'name') {
            await memberModel.updateOne({_id: decoded.id}, {$set: {name: value}});
            return res.status(201).json({msg: "name updated"})
        }
        // patch username
        if(field === 'username') {
            await memberModel.updateOne({_id: decoded.id}, {$set: {username: value}});
            return res.status(201).json({msg: "username updated"})
        }
    },
    //
    // HTTP PUT 
    // 
    putMember: async(req, res) => {
        try {
            const member = await createAndPutMember(req, res);
            const claims = getClaims(req);

            if(!member) {
                throw new Error("Can't update the member");
            }

            await memberModel.findByIdAndUpdate(claims.id, member);
            res.status(201).json({message: "Successful on update the member"});
        }
        catch(er) {
            console.error(er)
            res.status(500).json({message_error: "Server cannot update the member"});
        }
    }
}

