import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";
import { useNavigate } from "react-router-dom";
import "../CSS/Auth.css";
const Auth = () => {
  const [flag, setFlag] = useState(true);
  const [username, setUsername] = useState("");
  const [emailId, setemailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, seterror] = useState("");
  const navigate = useNavigate();

  const handlelogin = async () => {
    try {
      const res = await axios.post(BASE_URL + "login", { emailId, password },{withCredentials:true});
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }
      alert("login Successfull!");
      navigate("/home");
    } catch (err) {
      seterror(err.response?.data?.message || "Something went wrong");
      setTimeout(() => {
        seterror("");
      }, 3000);
    }
  };

  const handlesignup = async () => {
    try {
      const res=await axios.post(BASE_URL+"signup",{username,emailId,password});
      alert("Registered successfully....now log in");
      setFlag(true);
    } catch (err) {
      seterror(err.response?.data?.message || "Something went wrong");
      setTimeout(() => {
        seterror("");
      }, 3000);
    }
  };

  return (
    <div className="auth-page">
      {flag ? (
        <div className="auth_main">
          <h3>Email id:</h3>
          <input
            type="text"
            value={emailId}
            onChange={(e) => setemailId(e.target.value)}
          />
          <h3>Password</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handlelogin}>Login</button>
          {error && <p className="auth_error">{error}</p>}
          <p
            className="auth_toggle"
            onClick={() => {
              setFlag(!flag);
            }}
          >
            New user? <span>Create an account</span>
          </p>
        </div>
      ) : (
        <div className="auth_main">
          <h3>Username</h3>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <h3>Email id:</h3>
          <input
            type="text"
            value={emailId}
            onChange={(e) => setemailId(e.target.value)}
          />
          <h3>Password</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handlesignup}>Sign up</button>
          {error && <p className="auth_error">{error}</p>}
          <p
            className="auth_toggle"
            onClick={() => {
              setFlag(!flag);
            }}
          >
            Already have an account? <span>Log in</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Auth;
