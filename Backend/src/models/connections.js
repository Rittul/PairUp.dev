const mongoose=require("mongoose");

const Connectionschema= new mongoose.Schema({
    touserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    fromuserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },    status:{
        type:String,
        required:true,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message: "not a valid status",
        }
    }
},{timestamps:true});


const connection = mongoose.model("connection",Connectionschema);

module.exports=connection;