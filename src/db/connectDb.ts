import mongoose from "mongoose"
import { DbName } from "../constant/constant"
const connectDb = async ()=>{
   try {
   const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DbName}`)
   console.log(`MongoDb instance is Connected to host ${connectionInstance.connection.host}`)
   } catch (error) {
    console.log("MongoDb Connection Failed")
    process.exit(1)
   }
}

export default connectDb