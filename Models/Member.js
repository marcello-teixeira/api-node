import mongoose from 'mongoose';

// schema Member
export const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicure: {
        type: Buffer,
        required: false
    }   
  },
  {timestamps: true}
);

export const memberModel = mongoose.model('Member', MemberSchema);

