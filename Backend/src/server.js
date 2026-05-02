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
    origin: ["http://localhost:5173", "http://127.0.0.1:5173","https://pairup-dev.onrender.com"],
  credentials: true
}));

// app.use(cors({
//   origin: "*"
// }));
require('dotenv').config();

const authRouter= require("./routes/auth");
const profileRouter=require("./routes/profile");
const connectionRouter=require("./routes/connections");
const chatRouter=require("./routes/chat");


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRouter);
app.use("/",chatRouter);

const PORT = process.env.PORT || 3000;

connectdb().then(()=>{
    server.listen(PORT,(req,res)=>{
        console.log(`Server listening no port ${PORT} successfully...!`);
    })
})
.catch((err)=>{
    console.log(err.message);
});