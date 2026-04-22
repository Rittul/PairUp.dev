const express=require("express");
const connectionRouter=express.Router();
const userauth=require("../middlewares/auth");
const connection=require("../models/connections");
const mongoose=require("mongoose");


connectionRouter.post("/connection/:status/:touserId",userauth,async(req,res)=>{
    try{
        const currentUserId = req.user?.id || req.user?._id || req.user;
        const fromuserId=currentUserId;
        const touserId=req.params.touserId;
        const status=req.params.status;
        const ALLOWED_STATUSES = ["interested", "ignored", "accepted", "rejected"];
    
        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        if (!mongoose.Types.ObjectId.isValid(touserId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        if (["accepted", "rejected"].includes(status)) {
            if (String(currentUserId) !== String(touserId)) {
                return res.status(403).json({ message: "Only recipient can update this status" });
            }

            const otherUserId = req.body?.fromuserId || req.query?.fromuserId;
            const otherUserId = req.body?.fromuserId || req.query?.fromuserId;
            if (!otherUserId || !mongoose.Types.ObjectId.isValid(otherUserId)) {
                return res.status(400).json({ message: "Valid fromuserId is required" });
            }            
        }

        const conn=await connection.findOne({
            $or:[
                {fromuserId,touserId},
                {fromuserId:touserId,touserId:fromuserId}
            ]
        });
        if(conn){
            conn.status=status;
            const updated= await conn.save();
            return res.json({updated});
        }else{
            const connect=new connection({
                touserId,
                fromuserId,
                status,
            });
            const saved=await connect.save();
            return res.json({saved});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }})

connectionRouter.get("/getfriends",userauth,async(req,res)=>{
    try{
        const userid=req.user;
        const friends=await connection.find({
            $and:[
                {$or:[
                    {touserId:userid},
                    {fromuserId:userid},
                ]},
                {status:"accepted"},
            ]
        }).populate("touserId", "username").populate("fromuserId", "username");
        res.json({friends});
    }catch(err){
        res.send(err.message);
    }
})

connectionRouter.delete("/deletefriend/:friendId",userauth,async(req,res)=>{
    try{
        const userid=req.user;
        const friendId=req.params.friendId;
        if (!mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }
        const deleted=await connection.findOneAndDelete({
            $or:[
                {touserId:userid, fromuserId:friendId},
                {touserId:friendId,fromuserId:userid},
            ],
            status: "accepted",
        });
        if (!deleted) {
            return res.status(404).json({ message: "Friend connection not found" });
        }
        res.json({ message: "Friend removed successfully", deleted });
    }catch(err){
        res.send(err.message);
    }
})


connectionRouter.get("/getpendingrequests",userauth,async(req,res)=>{
    try{
        const userid=req.user;
       const pendingrequests = await connection.find({
            touserId: userid,
            status: "interested"
        }).populate("fromuserId", "username");
        if(pendingrequests.length === 0){
            return res.json({ message: "No request pending", pendingrequests: [] });
        }
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }    
})

module.exports=connectionRouter;