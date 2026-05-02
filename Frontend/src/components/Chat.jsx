import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { createsocketconnectio } from "../utils/socket";
import "../CSS/Chat.css";
import Navbar from "./Navbar";
const Chat = () => {
  const [targetuserid, setTargetuserid] = useState("");
  const navigate = useNavigate();
  const [userid, setuserid] = useState("");
  const [newMessage, setNewmessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const socketRef = useRef(null);
  const [flag, setFlag] = useState(false);
  const [chatuser, setChatuser] = useState("");
  const [dpurl, setDpurl] = useState("");
  const [chatfriend, setChatfriend] = useState([]);


  const fetchchatuser=async()=>{
      try{
        const res=await axios.get(BASE_URL+"getchatfriends",{withCredentials:true});
        setChatfriend(res.data.chats);
      }catch(err){
        console.error(err);
      }
  }

  const fetchuserid = async () => {
    try {
      const res = await axios.get(BASE_URL + "profile", {
        withCredentials: true,
      });
      if (res?.data?.user?._id) {
        setuserid(res.data.user._id);
      }
    } catch (err) {
      const status = err?.response?.status;
      const message = err?.response?.data || err?.message;
      console.error(message);
    }
  };


  useEffect(() => {
    fetchuserid();
    fetchchatuser();
  }, []);

  useEffect(() => {
    if (!userid || !targetuserid) {
      return;
    }

    const socket = createsocketconnectio();
    socketRef.current = socket;
    socket.emit("joinchat", { userid, targetuserid });

    socket.on("Messagerecived", ({ newMessage, senderId }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now() + Math.random(),
          text: newMessage,
          senderId,
          isMe: String(senderId) === String(userid),
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userid, targetuserid]);

  useEffect(() => {
    if (!userid || !targetuserid) return;

    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}chat/${targetuserid}`, {
          withCredentials: true,
        });
        const chat = res.data?.chat;
        if (chat && Array.isArray(chat.message)) {
          const mapped = chat.message.map((m) => ({
            id: m._id || Date.now() + Math.random(),
            text: m.text,
            senderId:
              typeof m.senderid === "object"
                ? String(m.senderid?._id)
                : String(m.senderid),
          }));
          const normalizedUserId = String(userid);
        setMessages(mapped.map(msg => ({
          ...msg,
          isMe: msg.senderId === normalizedUserId
        })));
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error("fetchChatHistory error:", err?.response?.data || err.message);
      }
    };

    fetchChatHistory();
  }, [userid, targetuserid]);

  const sendMessage = () => {
    try {
      if (
        !socketRef.current ||
        !userid ||
        !targetuserid ||
        !newMessage.trim()
      ) {
        return;
      }
      socketRef.current.emit("sendMessage", {
        userid,
        targetuserid,
        newMessage,
      });
      setNewmessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserSelect = (selectedUserId,selectedusername,photourl) => {
    setTargetuserid(selectedUserId);
    setChatuser(selectedusername);
    setDpurl(photourl);
    setQuery("");
    setResult([]);
    setFlag(true);
    setMessages([]);
  };

 useEffect(() => {
  const handler = setTimeout(async () => {
    if (!query) {
      setResult([]);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}search?q=${query}`,{withCredentials:true});
      setResult(res.data);
    } catch (err) {
      console.error(err);
    }
  }, 500);

  return () => clearTimeout(handler);
}, [query]);
  

  return (
    <>
      <Navbar />
      <div className="main-chat">
        <div className="left-pannel">
          
            <div className="srch-box">
                <input type="text" value={query} onChange={(e)=>setQuery(e.target.value)}/>
            </div>
            <div className="prev-chat-user">
            {chatfriend?.map(ch => (
              <div key={ch.chatId}>
                <p onClick={()=>handleUserSelect(ch.receiver?._id,ch.receiver?.username,ch.receiver?.photourl)}>{ch.receiver?.username}</p>
              </div>
            ))}
          </div>
            <div className="otpt">
                <ul>
                    {result.map(r=>(
                    <li key={r._id} onClick={() => handleUserSelect(r._id,r.username,r.photourl)}>{r.username}</li>
                    ))}
                </ul>
            </div>
        </div>

        {flag && <div className="right-pannel">
            {/* Chat Header — Profile + Name */}
            <div className="chat-header">
              <div className="dp"><img src={dpurl || null} alt={chatuser} /></div>
              <h1 className="cht-user">{chatuser}</h1>
            </div>

            {/* Messages Area */}
            <div className="chat-body">
              {messages.map((m) => (
                <div key={m.id} className={`modiji ${m.isMe ? "sent" : "received"}`}>
                  <div className={`message ${m.isMe ? "right" : "left"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="chat-footer">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewmessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div> }
      </div>
    </>
  );
};

export default Chat;
