import { memberModel } from '../Models/Member.js';
import bcrypt from 'bcrypt';
import fs from 'fs';

export async function createAndPutMember(req) {
    const { name, username, mail, password } = req.body;
    
    if(Object.keys(req.body).length === 0){
        console.log("Some field doesn't have data");
        return;
    }
    
    if(!name || !username || !mail || !password ) {
        console.log("Some field doesn't have data");
        return;
    }
    
    const is_mailOrUsernameRegistered = await memberModel
        .findOne({$or: [{mail: mail}, {username: username}]});
    
    if(is_mailOrUsernameRegistered) {
        console.log("Mail or username is already registered");
        return;
    }

     
    const pictureprofile = req.file;
    let imageBuffer = Buffer.alloc(0);

    if(!pictureprofile) {
        console.log('Image not defined');
    } else {
        imageBuffer = fs.readFileSync(pictureprofile.path);
        fs.unlinkSync(pictureprofile.path);
    }
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const member = {
        name, 
        username: username.toLowerCase(),
        mail,
        password: passwordHash,
        profilePicure: imageBuffer
    }

    return member;
}

