import mongoose from 'mongoose';

export async function connectionContext() {
    const uri = process.env.connection_context;

    try {
        await mongoose.connect(uri);
        console.log('database connected')
    } catch(er) {
        console.error(`ErrorConnectionDatabase: ${er}`);
    }
}