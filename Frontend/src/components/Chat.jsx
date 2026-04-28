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
      console.log(message);
    }
  };

  useEffect(() => {
    fetchuserid();
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
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
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
      console.log(err);
    }
  };

  const handleUserSelect = (selectedUserId,selectedusername) => {
    setTargetuserid(selectedUserId);
    setChatuser(selectedusername);
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
      console.log(res.data);
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
            <div className="otpt">
                <ul>
                    {result.map(r=>(
                    <li key={r._id} onClick={() => handleUserSelect(r._id,r.username)}>{r.username}</li>
                    ))}
                </ul>
            </div>
        </div>
        {flag && <div className="right-pannel">
            {/* Messages Area */}
            <h1>{chatuser}</h1>
            <div className="chat-body">
              {messages.map((m) => (
                <div key={m.id} className="modiji">
                  <div
                    className={`message ${m.senderId === userid ? "right" : "left"}`}
                  >
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
