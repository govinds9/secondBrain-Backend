

import mongoose,{Schema, Types} from "mongoose";


const LinkSchema =  new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true

    }
})

export const Link = mongoose.model("Link",LinkSchema)