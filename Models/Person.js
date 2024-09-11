import mongoose from 'mongoose';

const Person = mongoose.model('Person', {
    name: String,
    username: String,
    mail: String,
    password: String
});

export default Person;