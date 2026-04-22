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
        if(!emailId || !validator.isEmail(emailId)) {
            return res.status(400).json({ message: "not a valid email" });
        }

        const user= await User.findOne({emailId});
        if(!user) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const isvalidpassword=await bcrypt.compare(password,user.password);
        if(!isvalidpassword){
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1h",});
        res.cookie("token",token)
        return res.json({ message: "login successfull!......", token });
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
})

authRouter.post("/signup",async(req,res)=>{
    try{
        validatesignupdata(req);
        const {username,emailId,password}=req.body;
        const hashedpassword=await bcrypt.hash(password,10);
        const existingUser = await User.findOne({ emailId });

        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const user= new User({
            username,
            emailId,
            password:hashedpassword,
        });
        const saveduser=await user.save();
        res.json({message:"user added successfully..",data:saveduser});
    }catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }

        return res.status(500).json({ message: err.message });
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.clearCookie("token");
    res.send("logged out successfully!.....");
})

module.exports= authRouter;