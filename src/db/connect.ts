import mongoose from "mongoose";


export const ConnectDB = async ()=>{
    try{
     const conn = await mongoose.connect(process.env.MONGODB_URI as string)
     console.log(`MongoDb connected ${conn.connection.host}`)
    }catch(error:any){
        console.error(`Error message ${error.message}`)
        process.exit(1);
    }
}

