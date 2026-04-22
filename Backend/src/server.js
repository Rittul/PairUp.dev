const express =require("express")
const app=express()
const dotenv=require("dotenv");
const connectdb = require("./config/database")
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
require('dotenv').config();

const authRouter= require("./routes/auth");
const profileRouter=require("./routes/profile");
const connectionRouter=require("./routes/connections");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRouter);


connectdb().then(()=>{
    app.listen(3000,(req,res)=>{
        console.log("Server listening no port 3000 successfully...!");
    })
})
.catch((err)=>{
    console.log(err.message);
});