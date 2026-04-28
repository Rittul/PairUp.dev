import React,{ useState ,useEffect} from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import "../CSS/Navbar.css";
import Chat from './Chat';


const Navbar = () => {
    const [photourl, setPhotourl] = useState("");
    const [username, setUsername] = useState("")
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const fetchuserdetails=async()=>{
        try{
            const res=await axios.get(BASE_URL+"profile",{withCredentials:true});
        if(res?.data?.user?.username){
          setUsername(res.data.user.username);
            }
        if(res?.data?.user?.photourl){
            setPhotourl(res.data.user.photourl);
        }

        }catch(err){
          console.log(err);
        }
    }
    useEffect(() => {
      fetchuserdetails();
    }, [])

    const handlelogout=async()=>{
      try {
        await axios.post(BASE_URL + "logout",  { withCredentials: true });
      } catch (err) {
        console.log(err);
      } finally {
        localStorage.removeItem("token");
        setOpen(false);
        navigate("/", { replace: true });
      }
    }
    
  return (
    <>
      <div className="main_nav">
        <div className="logo"><Link to={"/home"} >◉—◉  PairUp.dev</Link></div>
        <div className="user-details">
            <div className="user-name">Welcome! {username}</div>
            <div className="user-pic">
              <img src={photourl || null} alt="User" onClick={() => setOpen(!open)}/>
            </div>
            <div className="chat-icon">
              <Link to={"/chat"}><img src="/chaticon.png" alt="Chat" /></Link>
            </div>
            {open && (
                <div className="dropdowns">
                    <Link to={"/profile"}>Profile</Link>
                    <Link to={"/updateprofile"} >Update Profile</Link>
                    <Link  onClick={handlelogout}>Log out</Link>
                </div>
            )}
        </div>
      </div>
    </>
  )
}

export default Navbar;
