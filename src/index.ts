import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import {z} from 'zod'
import bcrypt from 'bcrypt'
import { UserModel } from './db';
import cors from 'cors'
import { JWT_SCERET } from './config';
import { RequestHandler } from 'express';
import { any } from 'zod';
const app = express()

app.use(express.json())
app.use(cors());

app.post("/api/v1/signup",async (req: Request,res: Response) =>{
   // vadation input,
    const reqInputSchema =z.object({
        username:z.string().min(3).max(10),
        password:z.string().min(8).max(20)
    })

    const SchemaResult = reqInputSchema.safeParse(req.body)

    if(!SchemaResult.success){
    res.status(411).json({
            message:"Error in inputs"
        })
        return
    }
    
    const {username,password} = req.body;
    try{
    const UserExist =await UserModel.findOne({
        username
    })
    if(UserExist){
        res.status(403).json({
        message:"User already exists with username"
       })
       return
    }
    // hash password

    const hashedPassword = await bcrypt.hash(password,7)
   
    await UserModel.create({
        username:username,
        password:hashedPassword
    })

     res.status(200).json({
        message:"User signed up"
    })
    return

}catch(e){

      res.status(500).json({
        message:"Server error"
     })
     return
}


})

app.post("/api/v1/signin",async (req,res)=>{
    // vadation input,
    const reqInputSchema =z.object({
        username:z.string().min(3).max(10),
        password:z.string().min(6).max(20)
    })

    const SchemaResult = reqInputSchema.safeParse(req.body)

    if(!SchemaResult.success){
      res.status(411).json({
            message:"Error in inputs"
        })
        return
    }
    
    const {username,password} = req.body;


    try{
        const UserExist =await UserModel.findOne({
            username
        })
        if(!UserExist){
          res.status(403).json({
            message:"User is not signup"
          })
          return
        }

        const hash = UserExist.password
      const passwordMatch = await bcrypt.compare(password,hash)
     

       if(!passwordMatch){
        res.status(403).json({
            message:"pass is not"
        })

       }else{
        
        const token = jwt.sign({
            userId: UserExist?._id
         },JWT_SCERET)

         res.status(200).json({
            token
         })
         return
       }

    }catch(e){
        
      res.status(500).json({
        message:"Server error"
     })
     return

    }

})

app.post("/api/v1/content",(req,res)=>{

})

app.get("/api/v1/content",(req,res)=>{

})

app.delete("api/v1/content",(req,res)=>{

})

app.post("/api/v1/brain/share",(req,res)=>{

})

app.get("/api/v1/brain/:shareLink",(req,res)=>{

})

app.listen(3000,()=>{
    console.log("server is up")
})