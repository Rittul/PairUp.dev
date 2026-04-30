const mongoose= require("mongoose");

const messageschema= new mongoose.Schema({
    senderid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
        required:true
    },
},{timestamps:true});


const chatschema= new mongoose.Schema({
    particpants:[
        {type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
    ],
    message:[messageschema],
},{timestamps:true});

const Chat= mongoose.model("Chat",chatschema);

module.exports = Chat;