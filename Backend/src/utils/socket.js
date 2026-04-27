const socket = require("socket.io")
const crypto= require("crypto");

const generateroomid=(userid,targetuserid)=>{
    return crypto.createHash("sha256").update([userid,targetuserid].sort().join("_")).digest("hex");
}

const initializesocket=(server)=>{
    const io=socket(server,{
        cors:{
            origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        },
    });
   io.on("connection",(socket)=>{
        socket.on("joinchat",({userid,targetuserid})=>{
            // const roomid=[userid,targetuserid].sort().join("_");
            const roomid=generateroomid(userid,targetuserid);
            console.log(roomid);
            socket.join(roomid);
        });

        socket.on("sendMessage",({userid,targetuserid,newMessage})=>{
            // const roomid=[userid,targetuserid].sort().join("_");
            const roomid=generateroomid(userid,targetuserid);
            io.to(roomid).emit("Messagerecived",{newMessage, senderId: userid});
        });

        socket.on("disconnect",()=>{});
   });
};

module.exports = initializesocket;