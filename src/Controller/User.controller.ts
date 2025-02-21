
import { User } from "../Models/User.model";
import { Response,Request,NextFunction } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Tag } from "../Models/Tag.model";
import { Content } from "../Models/Content.model";
import mongoose, {deleteModel, ObjectId,Types } from "mongoose";
import { Link } from "../Models/Link.models";
interface UserType{
    name:string,
    password:string,
    email:string
}

interface contentType{
  type:string,
  title:string,
  link:string,
  tags:string[],
}
export interface jwtUser{
  _id:string,
  name:string,
  email:string
}
const registerUser = async(req:Request,res:Response,next:NextFunction)=>{
      const newUser:UserType = req.body

      if([newUser.name,newUser.email,newUser.password].some((field)=>field?.trim()==="")){
        res.status(400).json({
            status:400,
            message:"all Fields are Required"
        })
      }

      const existant = await User.findOne({email:newUser.email})

      if(existant){
        res.status(400).json({
            status:400,
            message:"User with Email Already Exists"
        })
      }
      const password = await bcrypt.hash(newUser.password,10)

      const user = await User.create({
        name:newUser.name,
        email:newUser.email,
        password:password
      })

      const createduser = await User.findById(user._id).select("-password")
      if(!createduser){
        res.status(500).json({
            status:500,
            message:"Something Went wrong while creating new User ",
            
        })
      }

      res.status(200).json({
        status:200,
        message:" User Register Successfully",
        data:createduser
    })

      
      
}


const loginUser = async(req:Request,res:Response,next:NextFunction)=>{

    const {email, password} = req.body

    if(email==="" || password===""){
        res.status(400).json({
            status:400,
            message:"all Fields are Required"
        })
    }
      const user = await User.findOne({email})

      if(!user) {
        res.status(400).json({
            status:400,
            message:"User Does't Exist"
        })
        return
      }

      const ispasswordCorrect = await bcrypt.compare(password,user?.password)
      if(!ispasswordCorrect){
        res.status(400).json({
            status:400,
            message:"Password Incorrect"
        })
      }
      const juser:jwtUser = {
        _id:user?._id.toString(),
        name:user?.name,
        email:user?.email
      }
     const privateKey = "gFx9TKDQzwMv9vJk7azqFtB8yQGi1iCuuyDgVDeLj7M"
      const accesstoken = jwt.sign(juser,privateKey,{
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      })

      if(!accesstoken){
        res.status(500).json({
            status:500,
            message:"Something Went Wrong while login"
        })
      }



      res.status(200).json({
        status:200,
        message:"User Login Successfully",
        token:accesstoken
    })
}


const check = async(arr:string[]):Promise<Types.ObjectId[]>=>{
   const tagarray: Types.ObjectId[]=[]
try {
  
  for(let i = 0;i<arr.length;i++){
    const existed = await Tag.findOne({title:arr[i]})
    if(existed!==null){
      
      tagarray.push(existed?._id)
    }
    else{
      const newtag = await Tag.create({
        title:arr[i]
       })
       tagarray.push(newtag?._id)
    }

  }
} catch (error) {
  throw error
}


    const tagArray = await Promise.all(tagarray);
    return tagArray;

}
   
const createContent= async (req:Request,res:Response)=>{
   const newcontant:contentType = req.body
   const tags:Types.ObjectId[]= await check(req.body.tags)
          
   
      
   const createdContent =  await Content.create({
    title:newcontant.title,
    link:newcontant.link,
    type:newcontant.type,
    tags:tags,
    userId:req.user?._id

   })

   if(!createdContent){
      res.status(500).json({
      status:500,
      message:"Internal Error"
       })
       return
   }

    res.status(200).json({
    status:200,
    message:"Content Created Successfully",
    data:createdContent
   })
}


const getAllcontent = async (req:Request,res:Response)=>{
  const userId = req.user?._id

  const allconntent = await Content.find({
    userId:userId
  }).populate({
    path:"userId",
    select:"name email"
  }).populate({
    path:"tags",
    select:"title"
  })

  

  res.status(200).json({
    status:200,
    data:allconntent
  })
}


const deletecontent = async(req:Request,res:Response)=>{
  const _id = req.params["_id"].replace(":","")
  const userId = req.user?._id

  try {
    const deleted = await Content.deleteMany({
      _id:_id,
      userId:userId
    })
  
    
  res.status(200).json({
    status:200,
    message:"Deleted Successfully "
  })
  } catch (error) {
    throw error
  }
}


const createLink = async (req: Request, res:Response)=>{

  const userId = req.user?._id
  const link = await Link.findOne({
    userId:userId
  })
  if(link){
    res.status(200).json({
      status:200,
      message:"Link send",
      data:link
    })
  }
  else{




    
    const newLink = await Link.create({
      userId:userId
    })
    
    
    if(!newLink){
      res.status(500).json({
        status:500,
        message:"Internl Error while creating Link"
      })
    }
    
    res.status(200).json({
      status:200,
      message:"Link Created Successfully",
      data:newLink
    })
    
  }

}


 const shareLink = async(req:Request, res:Response)=>{
  const _id = req.params["_id"].replace(":","")
  try {
    
    
    const link = await Link.findOne({
      _id:_id
    })
    
    const user = await User.findById(link?.userId)
    
    if(!user){
      res.status(400).json({
        status:400,
        message:"User not found "
      })
    }
    const data = await Content.find({
      userId:user?._id
    }).populate({
      path:"userId",
      select:"name email"
    }).populate({
      path:"tags",
      select:"title"
    })
    const userinfo = {
      name:user?.name,
      email:user?.email

    }
  
    res.status(200).json({
      status:200,
      message:"Data fetched Successfully",
      data,
      user:userinfo
  
    })
  
  } catch (error) {
    throw error
  }

 }


 const getUser = async (req:Request,res:Response)=>{
  const userinfo = req.user
  const link = await Link.findOne({
    userId:userinfo?._id
  })
 
  const user = {
    name:userinfo?.name,
    email:userinfo?.email,
    id:userinfo?._id,
    link:link
  }

  

  

  res.status(200).json({
    status:200,
    data:{user}
  })
}

export {loginUser,registerUser, createContent,getAllcontent ,deletecontent, createLink,shareLink,getUser}