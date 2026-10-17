import mongoose from 'mongoose';
import env from './env';
import dns from 'dns';

dns.setServers(['8.8.8.8','1.1.1.1','8.8.4.4']);

export async function connectDatabase(): Promise<void> {
    await mongoose.connect(env.mongodburi);
    console.log('MongoDb conectado.');
}