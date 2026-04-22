const express=require("express");
const connectionRouter=express.Router();
const userauth=require("../middlewares/auth");
const connection=require("../models/connections");

connectionRouter.post("/connection/:status/:touserId",userauth,async(req,res)=>{
    try{
        const fromuserId=req.user;
        const touserId=req.params.touserId;
        const status=req.params.status;
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
        res.send(err.message);
    }
})

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
        }).populate("touserId", "username");
        res.json({friends});
    }catch(err){
        res.send(err.message);
    }
})

connectionRouter.delete("/deletefriend/:friendId",userauth,async(req,res)=>{
    try{
        const userid=req.user;
        const friendId=req.params.friendId;
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


module.exports=connectionRouter;