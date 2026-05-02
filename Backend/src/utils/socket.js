const socket = require("socket.io");
const crypto= require("crypto");
const Chat=require("../models/chat");

const generateroomid=(userid,targetuserid)=>{
    return crypto.createHash("sha256").update([userid,targetuserid].sort().join("_")).digest("hex");
}

const initializesocket=(server)=>{
    const io=socket(server,{
        cors:{
            origin: ["http://localhost:5173", "http://127.0.0.1:5173","https://pairupdev.netlify.app"],
        },
    });
   io.on("connection",(socket)=>{
        socket.on("joinchat",({userid,targetuserid})=>{
            // const roomid=[userid,targetuserid].sort().join("_");
            const roomid=generateroomid(userid,targetuserid);
            socket.join(roomid);
        });

        socket.on("sendMessage",async ({userid,targetuserid,newMessage})=>{
            try{
                // const roomid=[userid,targetuserid].sort().join("_");
                const roomid=generateroomid(userid,targetuserid);
                io.to(roomid).emit("Messagerecived",{newMessage, senderId: userid});
                let chat = await Chat.findOne({
                    particpants:{$all: [userid,targetuserid]},
                });
                if(!chat){
                    chat= new Chat({
                        particpants:[userid,targetuserid],
                        message:[],
                    });
                }

                chat.message.push({
                    senderid:userid,
                    text:newMessage,
                })
                await chat.save();

            }catch(err){
                console.error(err.message);
            }
        });

        socket.on("disconnect",()=>{});
   });
};

module.exports = initializesocket;