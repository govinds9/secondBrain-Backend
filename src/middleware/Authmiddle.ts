import { Request, Response,NextFunction } from "express"

import jwt, { JwtPayload } from "jsonwebtoken"


const privateKey = "gFx9TKDQzwMv9vJk7azqFtB8yQGi1iCuuyDgVDeLj7M"

 export interface iJwtpayload extends JwtPayload {
    _id:string,
    name:string,
    email:string
}


const Authmidddle = async (req:Request,res:Response,next:NextFunction)=>{
    try {
        const token = req.header("Authorization")?.replace("Bearer ","")
        if( !token){
            res.status(400).json({
                status:400,
                message:"Token Not Found"
            })
                return
        }

        const user = await jwt.verify(token,privateKey) as iJwtpayload

        
        if(!user){
            res.status(400).json({
                status:400,
                message:"Invalid Aceess Token Relogin"
            })
            return
        }

        
       
        req.user = user 

      return next()


        
    } catch (error) {
        res.status(400).json({
            status:400,
            message:"User does not authorized",
            err:error
        })
    }
}

export {Authmidddle}