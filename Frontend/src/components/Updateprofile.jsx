import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import "../CSS/Updateprofile.css";
import { useNavigate } from "react-router-dom";

const Updateprofile = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [photourl, setPhotourl] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");
  const navigate=useNavigate();
  const handleupdate = async () => {
  try {
    const data = {};

    if (username?.trim()) data.username = username.trim();
    if (age) data.age = age;
    if (gender) data.gender = gender;
    if (photourl?.trim()) data.photourl = photourl.trim();
    if (about?.trim()) data.about = about.trim();

    if (typeof skills === "string" && skills.trim()) {
      data.skills = skills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    }

    const res = await axios.patch(
      BASE_URL + "update/profile",
      data,
      { withCredentials: true }
    );

    alert("Dev detail successfully updated");
    setUsername("");
    setAbout("");
    setAge(0);
    setSkills("");
    setGender("");
    setPhotourl("");
    navigate("/profile");
  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};

  return (
    <>
      <Navbar/>
      <div className="main-box">
        <div className="edit-box">
            <p>Username</p>
            <input type="text" placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            <input type="number" placeholder="age" value={age} onChange={(e)=>setAge(e.target.value)}/>
            <input type="text" placeholder="gender" value={gender} onChange={(e)=>setGender(e.target.value)}/>
            <input type="text" placeholder="photourl" value={photourl} onChange={(e)=>setPhotourl(e.target.value)}/>
            <input type="text" placeholder="skills" value={skills} onChange={(e)=>setSkills(e.target.value)}/>
            <input type="text" placeholder="about" value={about} onChange={(e)=>setAbout(e.target.value)}/>
            <button onClick={handleupdate}>Update profile</button>
        </div>
        <div className="show-box">
              <div className="p-photo">
                <img src={photourl || null} alt="" />
              </div>
              <div className="detail-box">
                <p>{username}</p>
                <p>{age}</p>
                <p>{gender}</p>
                <p>{skills}</p>
                <p>{about}</p>
              </div>
        </div>
      </div>
    </>
  )
}

export default Updateprofile
