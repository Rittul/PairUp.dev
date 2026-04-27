const express =require("express")
const app=express()
const dotenv=require("dotenv");
const connectdb = require("./config/database")
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http =require("http")
const server = http.createServer(app);
const initializesocket = require("./utils/socket");
initializesocket(server);


app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));

require('dotenv').config();

const authRouter= require("./routes/auth");
const profileRouter=require("./routes/profile");
const connectionRouter=require("./routes/connections");


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRouter);


connectdb().then(()=>{
    server.listen(3000,(req,res)=>{
        console.log("Server listening no port 3000 successfully...!");
    })
})
.catch((err)=>{
    console.log(err.message);
});