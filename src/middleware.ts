import {Request,Response,NextFunction} from 'express'
import jwt,{JwtPayload} from 'jsonwebtoken'
import { JWT_SCERET } from './config';
export const authMiddleware = (req:Request,res:Response,next:NextFunction)=>{
  // @ts-ignore
   const token = req.body.token

 const verifyed = jwt.verify(token as string,JWT_SCERET)

 if (verifyed){

  if (typeof verifyed === "string"){
    res.status(403).json({
      message:"You are not Invaild"
    })
    return
  }
  //@ts-ignore
    req.userId = ( verifyed  as JwtPayload).userId;
    next()
 }else{
    res.json({message:"you are not loggin"})
 }





}