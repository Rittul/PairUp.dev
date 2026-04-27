import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import { createsocketconnectio } from '../utils/socket';
import "../CSS/Chat.css";
import Navbar from './Navbar';
const Chat = () => {
    const {targetuserid}=useParams();
    const navigate = useNavigate();
    const [userid, setuserid] = useState("");
    const [newMessage, setNewmessage] = useState("");
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    const fetchuserid=async()=>{
        try{
            const res = await axios.get(BASE_URL + "profile", {
            withCredentials: true,
        });
        if (res?.data?.user?._id) {
            setuserid(res.data.user._id);
        }
        }catch(err){
            const status = err?.response?.status;
            const message = err?.response?.data || err?.message;
            console.log(message);
            if (status === 400 || status === 401 || status === 404) {
                localStorage.removeItem("token");
                navigate("/");
            }
        }
    }
    
    useEffect(()=>{
        fetchuserid();
    },[]);

    useEffect(() => {
        if (!userid || !targetuserid) {
            return;
        }

        const socket = createsocketconnectio();
        socketRef.current = socket;
        socket.emit("joinchat", { userid, targetuserid });

        socket.on("Messagerecived", ({ newMessage, senderId }) => {
            setMessages(prevMessages => [...prevMessages, {
                id: Date.now() + Math.random(),
                text: newMessage,
                senderId
            }]);
        });

        return()=>{
            socket.disconnect();
        };
    },[userid,targetuserid]);

    const sendMessage=()=>{
        try{
            if (!socketRef.current || !userid || !targetuserid || !newMessage.trim()) {
                return;
            }
            socketRef.current.emit("sendMessage",{userid,targetuserid,newMessage});
            setNewmessage("");
        }catch(err){
            console.log(err);
        }
    }

  return (
    <>
        <Navbar/>
        <div className="chat">
      
      {/* Messages Area */}
      <div className="chat-body">
        {messages.map((m)=>(
            <div key={m.id} className='modiji'>
                <div className={`message ${m.senderId === userid ? 'right' : 'left'}`}>{m.text}</div>
            </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="chat-footer">
                <input type="text" placeholder="Type a message..."  value={newMessage} onChange={(e)=>setNewmessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>

    </div>
    </>
  )
}

export default Chat
