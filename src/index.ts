import { app } from './app'
import dotenv from 'dotenv'
import connectDb from './db/connectDb'
dotenv.config()

connectDb().then(()=>app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})).catch((e)=>{
    console.log("MongoDb Connection Failed ",e)
})
const port = process.env.PORT || 3000


