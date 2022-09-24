import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
  DiscFull,
} from "@material-ui/icons";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share({ username }) {
  const { user } = useContext(AuthContext);
  const [fetchedUser, setFetchedUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  const viewColor = username ? "#1872f2" : "#53975";

  const submitHandler = async (e) => {
    e.preventDefault();
    if (desc.current.value == "") {
      return;
    }
    const newPost = {
      userId: user?._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      console.log(newPost);
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }
    try {
      await axios.post("/posts", newPost);
      window.location.reload();
    } catch (err) {}
  };

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const res = await axios.get("/users?username=" + user?.username);
        setFetchedUser(res.data);
      };
      fetchUser();
    } catch (err) {}
  }, []);

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              fetchedUser?.profilePicture
                ? PF + fetchedUser?.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user?.username + "?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
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
            </label>
            <button
              className="shareButton"
              style={{ backgroundColor: viewColor }}
              type="submit"
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
