import React, { Profiler, useContext, useRef, useState } from "react";
import "./updateProfile.css";
import Topbar from "../../components/topbar/Topbar";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { PermMedia } from "@material-ui/icons";

export default function UpdateProfile({ socket }) {
  const [status, setStatus] = useState("none");
  const currentCity = useRef();
  const bio = useRef();
  const from = useRef();
  const history = useHistory();
  const { user: currentUser } = useContext(AuthContext);

  const [coverPicFile, setCoverPicFile] = useState(null);
  const [coverPicFilename, setcoverPicFilename] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicFilename, setProfilePicFilename] = useState(null);
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (bio.current.value.length > 50) {
      bio.current.value = bio.current.value.substring(0, 99);
    }

    try {
      const res = await axios.post("/users/update/profile/" + currentUser._id, {
        status: status,
        bio: bio.current.value,
        currentCity: currentCity.current.value,
        from: from.current.value,
        coverPicture: coverPicFilename,
        profilePicture: profilePicFilename,
      });
      alert("your profile gets updated");
      history.push("/profile/" + currentUser.username);
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusSelect = (e) => {
    setStatus(e.target.value);
  };

  const handleCoverImgUpload = async (e) => {
    e.preventDefault();
    if (coverPicFile) {
      const data = new FormData();
      const coverPicFilename = Date.now() + coverPicFile.name;
      data.append("name", coverPicFilename);
      data.append("file", coverPicFile);
      setcoverPicFilename(coverPicFilename);
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
  };

  const handleProfileImgUpload = async (e) => {
    e.preventDefault();
    if (profilePicFile) {
      const data = new FormData();
      const profilePicFilename = Date.now() + profilePicFile.name;
      data.append("name", profilePicFilename);
      data.append("file", profilePicFile);
      setProfilePicFilename(profilePicFilename);
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
  };

  return (
    <div>
      <Topbar socket={socket} isUpdateProfile={true} />

      <div className="updateProfileFOrmWrapper">
        <h4>Kindly Fill Your updated Details</h4>
        <form id="profileUpdateForm" onSubmit={handleProfileUpdate}>
          <div className="updateProfileBox">
            <input
              type="text"
              id="updateProfileInput"
              placeholder="your current city?"
              ref={currentCity}
              className="updateProfileInput"
            />
            <input
              className="updateProfileInput"
              type="text"
              placeholder="bio"
              id="bio"
              ref={bio}
            />
            <input
              className="updateProfileInput"
              type="text"
              placeholder="from which city?"
              id="from"
              ref={from}
            />
            status:
            <select
              name="cars"
              id="cars"
              form="profileUpdateForm"
              onChange={handleStatusSelect}
              className="updateProfileInput"
            >
              <option selected="selected">None</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Engaged">Engaged</option>
            </select>
            {/* ///////////////////////////////////// */}
            <label htmlFor="file1" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Choose profile Picture </span>

              <input
                style={{ display: "none" }}
                type="file"
                id="file1"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setProfilePicFile(e.target.files[0])}
                className="updateProfileInput"
              />

              <span style={{ marginLeft: "5px" }}>{profilePicFilename}</span>
            </label>
            <button
              style={{ height: "30px", margin: "5px 0" }}
              onClick={handleProfileImgUpload}
            >
              {" "}
              upload
            </button>
            {/* //////////////////////////////////////////////// */}
            <label htmlFor="file2" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">
                Choose profile Background Picture{" "}
              </span>

              <input
                style={{ display: "none" }}
                type="file"
                id="file2"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setCoverPicFile(e.target.files[0])}
                className="updateProfileInput"
              />

              <span style={{ marginLeft: "5px" }}>{coverPicFilename}</span>
            </label>
            <button
              style={{ height: "30px", margin: "5px 0" }}
              onClick={handleCoverImgUpload}
            >
              {" "}
              upload
            </button>
            <button
              className="updateProfileInput"
              type="submit"
              style={{ backgroundColor: " #ff7a7a ", cursor: "pointer" }}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
