import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import "../CSS/Profile.css";

const Profile = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [photourl, setPhotourl] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState([]);
  const [fcount, setFcount] = useState(0);
  const [friends, setFriends] = useState([]);
  const [pendingrequestes, setPendingrequestes] = useState([]);
  const [flag, setFlag] = useState(true);

  const fetchfriendsdetail = async () => {
    try {
      const res = await axios.get(BASE_URL + "getfriends", {
        withCredentials: true,
      });
      setFriends(res?.data?.friends);
      setFcount(res?.data?.count);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchpendingrequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "getpendingrequests", {
        withCredentials: true,
      });
      if (res?.data?.pendingrequests) {
        setPendingrequestes(res?.data?.pendingrequests);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchuserdetail = async () => {
    try {
      const res = await axios.get(BASE_URL + "profile", {
        withCredentials: true,
      });
      if (res?.data?.user?._id) {
        setUserId(res.data.user._id);
      }
      if (res?.data?.user?.username) {
        setUsername(res.data.user.username);
      }
      if (res?.data?.user?.photourl) {
        setPhotourl(res.data.user.photourl);
      }
      if (res?.data?.user?.about) {
        setAbout(res.data.user.about);
      }
      if (res?.data?.user?.skills) {
        setSkills(res.data.user.skills);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleremove = async (fid) => {
    try {
      await axios.delete(BASE_URL + `deletefriend/${fid}`, {
        withCredentials: true,
      });
      alert("dev removed successfully!..");
      fetchfriendsdetail();
    } catch (err) {
      console.log(err);
    }
  };

  const handlestatus = async (status, fid) => {
    try {
      const res = await axios.post(
        BASE_URL + `connection/${status}/${fid}`,
        { fromuserId: userId },
        { withCredentials: true }
      );
      fetchfriendsdetail();
      fetchpendingrequest();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchuserdetail();
    fetchfriendsdetail();
    fetchpendingrequest();
  }, []);

  return (
    <div className="profile-page">
      <Navbar />

      {/* Floating particles */}
      <div className="particles-container">
        <span className="particle"></span>
        <span className="particle"></span>
        <span className="particle"></span>
        <span className="particle"></span>
        <span className="particle"></span>
      </div>

      <div className="main-profile">
        {/* Hero section */}
        <div className="profile-hero">
          <div className="profile-photo">
            <img src={photourl || null} alt={username} />
          </div>
          <h1 className="profile-username">{username}</h1>
          {about && <div className="user-about">{about}</div>}
        </div>

        {/* Stats bar */}
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{fcount}</span>
            <span className="stat-label">Connections</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">{skills.length}</span>
            <span className="stat-label">Skills</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">{pendingrequestes.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="skills-section">
            <h3 className="section-title">
              <span className="title-icon">⚡</span> Tech Stack
            </h3>
            <div className="users-skills">
              {skills.map((skill, index) => (
                <div className="skill-box" key={`${skill}-${index}`}>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends section */}
        <div className="f-section">
          <div className="f-switch">
            <p
              className={flag ? "active" : ""}
              onClick={() => setFlag(true)}
            >
              My Connections
            </p>
            <p
              className={!flag ? "active" : ""}
              onClick={() => setFlag(false)}
            >
              Pending Requests
            </p>
          </div>

          {flag ? (
            <div className="my-connection">
              {friends.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">👥</span>
                  <p>No connections yet</p>
                  <span className="empty-sub">Start pairing up with devs!</span>
                </div>
              ) : (
                <div className="con-box">
                  {friends.map((f) => (
                    <div className="con-crd" key={f._id}>
                      <div className="con-photo">
                        <img src={f.photourl || null} alt={f.username} />
                      </div>
                      <p className="con-na">{f.username}</p>
                      <button
                        className="con-remove"
                        onClick={() => handleremove(f._id)}
                      >
                        Remove dev
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-request">
              {pendingrequestes.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">📬</span>
                  <p>No pending requests</p>
                  <span className="empty-sub">All caught up!</span>
                </div>
              ) : (
                <div className="requet-card">
                  {pendingrequestes.map((p) => (
                    <div className="reques-inner-card" key={p.fromuserId._id}>
                      <div className="req-photo">
                        <img
                          src={p.fromuserId.photourl || null}
                          alt={p.fromuserId.username}
                        />
                      </div>
                      <p className="req-na">{p.fromuserId.username}</p>
                      <button
                        className="req-status req-accept"
                        onClick={() =>
                          handlestatus("accepted", p.fromuserId._id)
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="req-status req-reject"
                        onClick={() =>
                          handlestatus("rejected", p.fromuserId._id)
                        }
                      >
                        Reject
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
