// import React,{useState,useEffect} from 'react'
// import Navbar from './Navbar'
// import axios from 'axios';
// import { BASE_URL } from '../utils/constant';
// import "../CSS/Home.css";
// const Home = () => {
//   const [feed, setFeed] = useState([]);
//   const [userId, setUserId] = useState("");
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const fetchUserProfile = async () => {
//     try {
//       const res = await axios.get(BASE_URL + "profile", { withCredentials: true });
//       if (res?.data?.user?._id) {
//         setUserId(res.data.user._id);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchfeed=async()=>{
//       try{
//         const res=await axios.get(BASE_URL+"feed",{withCredentials:true});
//         // console.log(res);
//         setFeed(res.data.feeds);
//       }catch(err){
//           console.log(err);
//       }
//   }

//   const handleStatus = async (status, targetUserId) => {
//     try {
//       await axios.post(
//         BASE_URL + `connection/${status}/${targetUserId}`,
//         { fromuserId: userId },
//         { withCredentials: true }
//       );
//       // Move to next card
//       setCurrentIndex(currentIndex + 1);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchUserProfile();
//     fetchfeed();
//   }, [])

//   if (feed.length === 0) {
//     return (
//       <>
//         <Navbar />
//         <div className="feed-card">
//           <p>No more users to show</p>
//         </div>
//       </>
//     );
//   }

//   if (currentIndex >= feed.length) {
//     return (
//       <>
//         <Navbar />
//         <div className="feed-card">
//           <p>No more users to show</p>
//         </div>
//       </>
//     );
//   }

//   const currentUser = feed[currentIndex];

//   return (
//     <>
//     <Navbar/>
//         <div className="feed-card">
//           <div className="fc" key={currentUser._id}>
//               <img src={currentUser.photourl} alt="" />
//               <p>{currentUser.username}</p>
//               <p>{currentUser.gender}</p>
//               <p>{currentUser.about}</p>
//               <button className="ac" onClick={() => handleStatus("interested", currentUser._id)}>Interested</button>
//               <button className="dc" onClick={() => handleStatus("ignored", currentUser._id)}>Ignore</button>
//           </div>
//         </div>
//     </>
//   )
// }

// export default Home


import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import axios from 'axios';
import { BASE_URL } from '../utils/constant';
import '../CSS/Home.css';

const Home = () => {
  const [feed, setFeed] = useState([]);
  const [userId, setUserId] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null); // 'left' | 'right' | null
  const [stamp, setStamp] = useState(null);       // 'INTERESTED' | 'IGNORED' | null

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(BASE_URL + "profile", { withCredentials: true });
      if (res?.data?.user?._id) setUserId(res.data.user._id);
    } catch (err) { console.log(err); }
  };

  const fetchfeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "feed", { withCredentials: true });
      setFeed(res.data.feeds);
    } catch (err) { console.log(err); }
  };

  const handleStatus = async (status, targetUserId) => {
    // 'interested' → swipe RIGHT (card flies right),  'ignored' → swipe LEFT
    const dir = status === "interested" ? "right" : "left";
    const lbl = status === "interested" ? "INTERESTED ✦" : "IGNORED ✕";

    setSwipeDir(dir);
    setStamp(lbl);

    // wait for animation (600ms) then advance
    setTimeout(async () => {
      try {
        await axios.post(
          BASE_URL + `connection/${status}/${targetUserId}`,
          { fromuserId: userId },
          { withCredentials: true }
        );
      } catch (err) { console.log(err); }

      setSwipeDir(null);
      setStamp(null);
      setCurrentIndex(prev => prev + 1);
    }, 620);
  };

  useEffect(() => {
    fetchUserProfile();
    fetchfeed();
  }, []);

  const EmptyState = () => (
    <>
      <Navbar />
      <div className="feed-wrapper">
        <div className="empty-state">
          <div className="empty-icon">⚡</div>
          <p className="empty-title">All caught up</p>
          <p className="empty-sub">No more devs in your feed right now.<br />Check back later.</p>
        </div>
      </div>
    </>
  );

  if (feed.length === 0 || currentIndex >= feed.length) return <EmptyState />;

  const u = feed[currentIndex];

  return (
    <>
      <Navbar />
      <div className="feed-wrapper">

        {/* Stack hint — ghost cards behind */}
        <div className="card-stack">
          <div className="ghost-card ghost-2" />
          <div className="ghost-card ghost-1" />

          {/* Main swipeable card */}
          <div className={`fc ${swipeDir ? `swipe-${swipeDir}` : ''}`}>

            {/* Stamp overlays */}
            {stamp && (
              <div className={`stamp ${swipeDir === 'right' ? 'stamp-yes' : 'stamp-no'}`}>
                {stamp}
              </div>
            )}

            {/* Photo */}
            <div className="fc-photo-wrap">
              <img src={u.photourl} alt={u.username} className="fc-photo" />
              {/* gradient overlay at bottom */}
              <div className="fc-photo-gradient" />
            </div>

            {/* Info */}
            <div className="fc-info">
              <div className="fc-name-row">
                <span className="fc-name">{u.username}</span>
                {u.age && <span className="fc-age">{u.age}</span>}
              </div>
              {u.gender && <p className="fc-gender">{u.gender}</p>}
              {u.about  && <p className="fc-about">{u.about}</p>}
              {u.skills?.length > 0 && (
                <div className="fc-skills">
                  {u.skills.map((s, i) => (
                    <span key={i} className="fc-skill-tag">{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="fc-actions">
              <button
                className="btn-action btn-ignore"
                onClick={() => handleStatus("ignored", u._id)}
                disabled={!!swipeDir}
              >
                <span className="btn-icon">✕</span>
                <span className="btn-label">Ignore</span>
              </button>

              <button
                className="btn-action btn-interest"
                onClick={() => handleStatus("interested", u._id)}
                disabled={!!swipeDir}
              >
                <span className="btn-icon">♥</span>
                <span className="btn-label">Interested</span>
              </button>
            </div>

          </div>
        </div>

        {/* Progress indicator */}
        <div className="feed-progress">
          {feed.slice(currentIndex, currentIndex + 5).map((_, i) => (
            <div key={i} className={`progress-dot ${i === 0 ? 'active' : ''}`} />
          ))}
        </div>

      </div>
    </>
  );
};

export default Home;