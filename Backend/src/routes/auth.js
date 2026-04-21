const express=require("express");
const authRouter=express.Router();
const jwt =require("jsonwebtoken");
const bcrypt=require("bcrypt");
const User=require("../models/users");
const validator=require("validator");
const validatesignupdata=require("../utils/validation")


authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId, password}=req.body;
        if(!emailId || !validator.isEmail(emailId)) throw new Error("not a valid email");
        const user= await User.findOne({emailId});
        if(!User) throw new Error("No user found pls sign up");
        const isvalidpassword=bcrypt.compare(password,user.password);
        if(!isvalidpassword){
            res.status(401).send("Invalid credentials!");
        }
        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1h",});
        res.cookie("token",token)
        res.send("login successfull!......");
    }catch(err){
        res.send(err.message);
    }
})

authRouter.post("/signup",async(req,res)=>{
    try{
        validatesignupdata(req);
        const {username,emailId,password}=req.body;
        const hashedpassword=await bcrypt.hash(password,10);
        const user= new User({
            username,
            emailId,
            password:hashedpassword,
        });
        const saveduser=await user.save();
        res.json({message:"user added successfully..",data:saveduser});
    }catch(err){
        console.log(err.message);
        res.status(400).send(err.message);
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.clearCookie("token");
    res.send("logged out successfully!.....");
})

module.exports= authRouter;