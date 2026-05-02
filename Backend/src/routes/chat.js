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
        console.error(err);
    }
});


chatRouter.get("/getchatfriends",userauth,async(req,res)=>{
    const loggedinuserid=req.user;
    try{
         const chats = await Chat.find({
            particpants: loggedinuserid
        }).populate("particpants", "username photourl");

        const formattedChats = chats.map(chat => {
            const receiver = chat.particpants.find(
                user => user._id.toString() !== loggedinuserid.toString()
            );

            return {
                chatId: chat._id,
                receiver: {
                    _id: receiver._id,
                    username: receiver.username,
                    photourl: receiver.photourl
                }
            };
        });

        res.json({ chats: formattedChats });
    }catch(err){
        res.status(500).send(err.message);
    }
});

module.exports = chatRouter;