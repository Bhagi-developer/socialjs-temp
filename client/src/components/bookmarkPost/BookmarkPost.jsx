import { Bookmark, BookmarkBorderOutlined, Delete } from "@material-ui/icons";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import "./bookmarkPost.css";

export default function BookmarkPost({ postId }) {
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await axios.get("/posts/" + postId);
        setPost(res.data);
      };
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const res = await axios.get(`/users?userId=${post?.userId}`);
        setUser(res.data);
      };
      fetchUser();
    } catch (err) {
      console.log(err);
    }
  }, [post?.userId]);

  return (
    <div className="mainDiv">
      <div className="bookmarkPost">
        <div className="bookmarkPostWrapper">
          <div className="bookmarkPostTop">
            <div className="bookmarkPostTopLeft">
              <Link to={`/profile/${user.username}`}>
                <img
                  className="bookmarkPostProfileImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                />
              </Link>
              <span className="bookmarkPostUsername">{user.username}</span>
              <span className="bookmarkPostDate">
                {format(post?.createdAt)}
              </span>
            </div>
          </div>
          <div className="bookmarkPostCenter">
            <span className="bookmarkPostText">{post?.desc}</span>
            <img className="bookmarkPostImg" src={PF + post?.img} alt="" />
          </div>
          <div style={{ textAlign: "right", color: "gray" }}>
            you bookmarked this post
          </div>
        </div>
      </div>
    </div>
  );
}
