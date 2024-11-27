import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import { JWT_SCERET } from './config';
export const authMiddleware = (req:Request,res:Response,next:NextFunction)=>{
  // @ts-ignore
   const token:string = req.headers.authorization;

 const verifyed = jwt.verify(token,JWT_SCERET)

 if (verifyed){

    const decodeValue = jwt.decode(token)
      // @ts-ignore
    req.userId = decodeValue.userId;
    next()
 }else{
    res.json({message:"you are not loggin"})
 }





}