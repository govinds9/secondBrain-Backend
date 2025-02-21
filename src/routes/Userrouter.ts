
import { NextFunction, Router } from "express";
import {  createContent, createLink, deletecontent, getAllcontent, getUser, loginUser, registerUser, shareLink } from "../Controller/User.controller";
import { Authmidddle } from "../middleware/Authmiddle";



const router = Router()



router.route('/signup').post(registerUser)
router.route('/signin').post(loginUser)
router.route('/me').get(Authmidddle,getUser)

router.route("/content").post(Authmidddle,createContent)
router.route("/allcontent").get(Authmidddle,getAllcontent)
router.route("/deletecontent/:_id").delete(Authmidddle,deletecontent)
router.route("/link").get(Authmidddle,createLink)
router.route("/share/:_id").get(shareLink)



export default router