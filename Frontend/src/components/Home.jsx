import React,{useState,useEffect} from 'react'
import Navbar from './Navbar'
import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import "../CSS/Home.css";
const Home = () => {
  const [feed, setFeed] = useState([]);
  const [userId, setUserId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(BASE_URL + "profile", { withCredentials: true });
      if (res?.data?.user?._id) {
        setUserId(res.data.user._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchfeed=async()=>{
      try{
        const res=await axios.get(BASE_URL+"feed",{withCredentials:true});
        // console.log(res);
        setFeed(res.data.feeds);
      }catch(err){
          console.log(err);
      }
  }

  const handleStatus = async (status, targetUserId) => {
    try {
      await axios.post(
        BASE_URL + `connection/${status}/${targetUserId}`,
        { fromuserId: userId },
        { withCredentials: true }
      );
      // Move to next card
      setCurrentIndex(currentIndex + 1);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchfeed();
  }, [])

  if (feed.length === 0) {
    return (
      <>
        <Navbar />
        <div className="feed-card">
          <p>No more users to show</p>
        </div>
      </>
    );
  }

  if (currentIndex >= feed.length) {
    return (
      <>
        <Navbar />
        <div className="feed-card">
          <p>No more users to show</p>
        </div>
      </>
    );
  }

  const currentUser = feed[currentIndex];

  return (
    <>
    <Navbar/>
        <div className="feed-card">
          <div className="fc" key={currentUser._id}>
              <img src={currentUser.photourl} alt="" />
              <p>{currentUser.username}</p>
              <p>{currentUser.gender}</p>
              <p>{currentUser.about}</p>
              <button className="ac" onClick={() => handleStatus("interested", currentUser._id)}>Interested</button>
              <button className="dc" onClick={() => handleStatus("ignored", currentUser._id)}>Ignore</button>
          </div>
        </div>
    </>
  )
}

export default Home
