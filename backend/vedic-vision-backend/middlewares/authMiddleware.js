const jwt=require("jsonwebtoken")
const env=require("dotenv")
const userModel=require('../models/userModel')
const asynhandler=require("express-async-handler")
env.config()
const protect=asynhandler(async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer") )
    {
        try{
            
            token=req.headers.authorization.split(" ")[1];
            
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            req.user=await userModel.findById(decoded.id).select("-password")
            next()
        }
        catch(err)
        {
            res.status(401)
            throw new Error("not authorized token failed")
        }
    }
    else{
        res.status(401)
            throw new Error("not authorized token failed")
    }
})
module.exports={protect}