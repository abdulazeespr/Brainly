import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import {z} from 'zod'
import bcrypt from 'bcrypt'
import { ContentModel, LinkModel, UserModel } from './db';
import cors from 'cors'
import { JWT_SCERET } from './config';

import { any } from 'zod';
import { authMiddleware } from './middleware';
import { RandomString } from './utilis';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

const app = express()



app.use(express.json())
app.use(cors());


app.post("/api/v1/signup",async (req: Request,res: Response) =>{
   // vadation input,
    const reqInputSchema =z.object({
        username:z.string(),
        password:z.string()
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
        username:z.string(),
        password:z.string()
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

app.post("/api/v1/content",authMiddleware,async (req,res)=>{

    const {type,link,title} = req.body;


    try{
   await ContentModel.create({
        type,
        link,
        title,
   //@ts-ignore
        userId:req.userId

    })

    res.status(200).json({
        message:"Content is added"
    })
    return
}catch(e){
    console.log(e)
    res.status(501).json({
        message:"server error"
    })
    return
}
     

    



})

app.get("/api/v1/content",authMiddleware,async (req,res)=>{
//@ts-ignore
  const userId = req.userId;
  try {
  const Content = await ContentModel.find({
       userId
  })

  res.status(200).json({
    content :Content
  })
  return


  }catch(e){

    res.status(501).json({
        message:"server error"
    })
    return


  }
  


})

app.delete("/api/v1/contentdelete",authMiddleware,async (req,res)=>{
     console.log("hi here ..")
    const contentId = req.body.contentId;
    try {
    await ContentModel.deleteOne({






            _id: contentId,
        //@ts-ignore
        userId: req.userId


    })

    res.json({
        message: "Deleted"
    })
   return

}catch(e){

    res.status(501).json({
        message:"server error"
    })
    return


}
})



app.post("/api/v1/brain/share", authMiddleware, async (req: Request, res: Response) => {
    const reqInputSchema = z.object({
        share: z.boolean()
    })

    const SchemaResult = reqInputSchema.safeParse(req.body)
    if (!SchemaResult.success) {
        res.status(411).json({
            message: "Error in inputs"
        })
        return
    }

    const { share } = req.body;
    
    try {
        if (!share) {
            // Delete existing share link if share is false
            await LinkModel.deleteOne({
                //@ts-ignore
                userId: req.userId
            })
            res.status(200).json({
                message: "Share link removed"
            })
            return
        }

        // Generate new hash
        const hashString = RandomString(10)
        
        // Delete any existing link first
        await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        })

        // Create new link
        const link = await LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hashString
        })

        res.status(200).json({
            hash: hashString
        })
        return

    } catch (e) {
        res.status(500).json({
            message: "Server error"
        })
        return
    }
})

app.get("/api/v1/brain/:shareLink",async (req,res)=>{

    const hashLink = req.params.shareLink

    try{

      const link = await LinkModel.findOne({
        hash :hashLink,
       })

     if(!link){
        res.status(411).json({
            message: "invaild Input"
        })
        return
     }

    const content = await ContentModel.find({
        userId : link?.userId
    })

    const user = await UserModel.findById(link?.userId)

      res.status(200).json({
        username:user?.username,
        content:content
      })
    return

    }catch(e){



        res.json({
            message:"invaild input or Server down"
        })
      
          return
    }



})


app.listen(3000,()=>{
    console.log("server is up")
})