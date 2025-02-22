import mongoose from 'mongoose';

export const connect = async(): Promise<void> => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to database')
    } catch (e){
        console.log(e.message)
    }
}
