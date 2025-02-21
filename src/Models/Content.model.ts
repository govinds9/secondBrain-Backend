

import mongoose,{Schema} from "mongoose";

const contentType = ["youtube", "twitter","document","links"]

const contentSchema = new Schema({
    link:{
        type:String,
        required:true,

    },
    title:{
        type:String,
        required:true

    },
    type:{
        type:String,
        required:true,
        enum:contentType
    },
    tags:[{type:Schema.Types.ObjectId,ref:'Tag'}],
    userId:{
        type:Schema.Types.ObjectId,ref:"User",required:true
    }
},{
    timestamps:true
})

export const Content = mongoose.model("Content",contentSchema)