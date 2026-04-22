const mongoose=require("mongoose");

const Connectionschema= new mongoose.Schema({
    touserId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },
    fromuserId:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted"],
            message: "not a valid status",
        }
    }
},{timestamps:true});


const connection = mongoose.model("connection",Connectionschema);

module.exports=connection;