import axios from "axios";
import React, { useRef, useState } from "react";
import "./forgotPasswordForm.css";
import emailjs from "emailjs-com";
import { Link } from "react-router-dom";

export default function ForgotPasswordForm() {
  const email = useRef();
  const username = useRef();
  const [hashPassword, setHashedPassword] = useState("some Error Occured");

  const handleFormdata = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/users/user/ForgotPassword", {
        username: username.current.value,
        email: email.current.value,
      });

      setHashedPassword(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleForgotPassClick = async (e) => {
    e.preventDefault();

    try {
      emailjs.sendForm(
        "service_o84rj15",
        "template_uo39ow8",
        e.target,
        "WNJR89IC8i6497LoG"
      );

      alert("credential sent to your email");
      return;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <h4>Fill following details to get ur password</h4>
      <span
        style={{
          color: "red",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        You will get an email only if your credentials are correct
      </span>
      <form className="forgotPasswordBox" onSubmit={handleForgotPassClick}>
        <input
          placeholder="Username"
          type="text"
          name="username"
          required
          className="forgotPasswordInput"
          ref={username}
        />
        <input
          placeholder="Email"
          type="email"
          name="email"
          required
          className="forgotPasswordInput"
          ref={email}
        />
        <h3>Click the following button before Submit </h3>
        <button
          onClick={handleFormdata}
          style={{ cursor: "pointer", height: "36px" }}
        >
          Update Form Data{" "}
        </button>
        <input
          placeholder="Email"
          type="text"
          style={{ display: "none" }}
          name="password"
          required
          className="forgotPasswordInput"
          value={hashPassword}
        />

        <button className="forgotPasswordButton" type="submit">
          {" "}
          Submit
        </button>
        <Link to="/login">
          <button
            style={{
              cursor: "pointer",
              height: "30px",
              width: "50%",
              margin: "10px",
            }}
          >
            Go to Login
          </button>
        </Link>
      </form>
    </div>
  );
}
