import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { PermMedia, Visibility } from "@material-ui/icons";
import emailjs from "emailjs-com";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(null);
  const [passwordType, setPasswordType] = useState("password");
  const [hashedPassword, setHashedPassword] = useState("soem error occured");
  const [registerErr, setRegisterErr] = useState("");
  const [isRegisteredSuccessfully, setIsRegisteredSuccessfully] =
    useState(false);

  const handleUploadImg = async (e) => {
    e.preventDefault();
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      setFilename(fileName);
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (isRegisteredSuccessfully) {
      try {
        emailjs.sendForm(
          "service_o84rj15",
          "template_5nprjfb",
          e.target,
          "WNJR89IC8i6497LoG"
        );
        alert(
          "credential sent to your email, kindly refer them while Logging!"
        );
        history.push("/login");
        return;
      } catch (err) {
        console.log(err);
      }
      history.push("/login");
    }
  };

  const handlePasswordType = () => {
    if (passwordType == "text") {
      setPasswordType("password");
    } else {
      setPasswordType("text");
    }
  };

  const handleFormData = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };

      try {
        const res = await axios.post("/auth/register", user);
        if (file) {
          try {
            await axios.post("/users/updateProfileImg/" + res.data._id, {
              ProfileUrl: filename,
            });
          } catch (err) {}
        }

        setHashedPassword(res.data.password);
        setIsRegisteredSuccessfully(true);
      } catch (err) {
        setRegisterErr("username or email already exist, please try another.");
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SocialJs</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social.
          </span>
          <img
            src="https://source.unsplash.com/random/400×300?friends"
            style={{ height: "300px", objectFit: "contain", margin: "20px" }}
          />
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
              name="username"
            />
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
              name="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type={passwordType}
              minLength="6"
            />
            <input
              placeholder="Password Again"
              required
              ref={passwordAgain}
              className="loginInput"
              type={passwordType}
            />
            <input
              placeholder="Password Again"
              required
              style={{ display: "none" }}
              className="loginInput"
              value={hashedPassword}
              name="hashedPassword"
            />
            <span onClick={handlePasswordType} style={{ cursor: "pointer" }}>
              <Visibility /> {passwordType == "text" ? "Hide" : "View"} Password
            </span>

            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <span style={{ marginLeft: "5px" }}>{filename}</span>
            </label>

            <button
              style={{ height: "30px", margin: "5px 0" }}
              onClick={handleUploadImg}
            >
              {" "}
              upload
            </button>
            <h5>Kindly click following form before register</h5>
            <button
              style={{ height: "30px", margin: "5px 0", cursor: "pointer" }}
              onClick={handleFormData}
            >
              {" "}
              update form data
            </button>

            <button className="loginButton" type="submit">
              Sign Up
            </button>
            <h4 style={{ color: "red", margin: "8px" }}>{registerErr}</h4>
            <Link to="/login">
              <button className="loginRegisterButton">Log into Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
