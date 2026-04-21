const express=require("express");
const profileRouter=express.Router();
const authuser=require("../middlewares/auth")
const User=require("../models/users");


profileRouter.get("/profile", authuser, async(req,res)=>{
    try{
        const userid=req.user;
        const user=await User.findOne({_id:userid}).select("username emailId gender age skills about photourl");
        if(!user) throw new Error("uer not found");
        res.json({user});
    }catch(err){
        res.send(err.message);
    }
})

profileRouter.patch("/update/profile",authuser,async(req,res)=>{
    try{
        const userid=req.user;
        const user=await User.findOne({_id:userid});
        if(!user) throw new Error("no user found");
        const allowedUpdates= ["username","age","gender","photourl","skills","about"];
        const updates=Object.keys(req.body);
        const isvalidUpdates=updates.every((field)=>{
            return allowedUpdates.includes(field)
        });
        if(!isvalidUpdates){
            return res.send("invalid updates!.....");
        }
        updates.forEach((it)=>{
            user[it]=req.body[it];
        })
        await user.save();
        res.json({user});
    }catch(err){
        return res.send(err.message);
    }
})

module.exports= profileRouter;