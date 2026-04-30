const express= require("express");
const chatRouter = express.Router();
const userauth= require("../middlewares/auth");
const Chat =require("../models/chat");

chatRouter.get("/chat/:targetuserid",userauth,async(req,res)=>{
    const userid=req.user;
    const targetuserid=req.params.targetuserid;
    try{
        let chat= await Chat.findOne({
            particpants: {$all:[userid,targetuserid]},
        }).populate({
            path:"message.senderid",
            select:" username",
        });
        if(!chat){
            chat =new Chat({
                particpants: [userid,targetuserid],
                message:[],
            });
            await chat.save();
        }
        res.json({chat});
    }catch(err){
        console.log(err);
    }
})

module.exports = chatRouter;