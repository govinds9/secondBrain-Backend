import express,{Express,Request,Response } from  'express'
import   cors from 'cors'

const app:Express = express()
app.use(cors())

app.use(express.json())


import  UserRouter  from "./routes/Userrouter"
app.use("/api/v1/user", UserRouter)



export {app}