import mongoose, {model,Schema} from "mongoose";
import { MONGODB_URL } from "./config";

mongoose.connect(MONGODB_URL)

const UserSchema = new Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true}
})

const contentTypes = ['image','video','article','audio']

const ContentSchema = new Schema({
    link:{type:String,required:true},
    type:{type:String ,enum:contentTypes,required:true},
    title:{type:String,required:true},
    tags:[{type:Schema.Types.ObjectId,ref:'Tag'}],
    userId:{type:Schema.Types.ObjectId,ref:'User',required:true}

})

const TagSchema = new Schema({
    title:{type:String,required:true, unique:true}
})

const LinkSchema = new Schema({
    hash:{type: String,required:true},
    userId:{type:Schema.Types.ObjectId,ref:'Link',required:true}
})



export const ContentModel = model('Content',ContentSchema)
export const TagModel = model('Tag',TagSchema)
export const LinkModel = model('Link',LinkSchema)

export const UserModel = model('User',UserSchema)