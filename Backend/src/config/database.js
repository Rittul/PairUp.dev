const mongoose =require("mongoose")

const connectdb =async(req,res)=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
        console.log("Database connected successfully.....!");
    }catch(err){
        console.log(err);
        res.send(err.message)
    }
}

module.exports = connectdb;