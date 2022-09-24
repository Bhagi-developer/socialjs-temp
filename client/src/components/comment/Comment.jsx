import {
  DeleteOutlineOutlined,
  LaptopWindows,
  ThumbUp,
  ThumbUpOutlined,
} from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import "./comment.css";

export default function Comment({ comment, setRefreshCommentRef }) {
  const [commentOwner, setCommentOwener] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes.length);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    try {
      const fetchCommentOwner = async () => {
        const commentOwner = await axios.get(
          "/users?userId=" + comment.commentUserId
        );
        setCommentOwener(commentOwner.data);
      };
      fetchCommentOwner();
    } catch (err) {
      console.log(err);
    }
  }, [comment]);

  // useEffect(() => {
  //   try {
  //     const fetchCommentLikes = async () => {
  //       const rs = await axios.get("/posts/comment/likesLength/" + comment._id);
  //       setLikes(rs.data);
  //       alert(rs.data);
  //     };
  //     fetchCommentLikes();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [comment]);

  useEffect(() => {
    try {
      const isCommentLiked = async () => {
        const res = await axios.get(
          "/posts/comment/isLiked/" + comment._id + "/" + currentUser._id
        );
        if (res.data == "yes") {
          setIsLiked(true);
        } else if (res.data == "no") {
          setIsLiked(false);
        }
      };
      isCommentLiked();
    } catch (err) {
      console.log(err);
    }
  }, [comment]);

  const handleCommentDelete = async () => {
    if (window.confirm("You sure? Comment will be deleted forever!")) {
      try {
        const res = await axios.delete("/posts/comment/delete/" + comment._id);
        setRefreshCommentRef(Math.random());
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCommentLike = async () => {
    try {
      const res = await axios.put("/posts/comment/like/" + comment._id, {
        userId: currentUser._id,
      });
      const rs = await axios.get(
        "/posts/comment/isLiked/" + comment._id + "/" + currentUser._id
      );
      if (rs.data == "yes") {
        setIsLiked(true);
        setLikes(likes + 1);
      } else if (rs.data == "no") {
        setIsLiked(false);
        setLikes(likes - 1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="singleCommentWrapper">
      <div className="commentTop">
        <Link
          to={`/profile/${commentOwner.username}`}
          style={{ textDecoration: "none", color: "gray" }}
        >
          <img
            className="singlePostProfileImg"
            src={
              commentOwner.profilePicture
                ? PF + commentOwner.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <span className="singleCommentOwnername">
            {commentOwner.username}
          </span>
          <span className="commentPostDate">{format(comment?.createdAt)}</span>
        </Link>
        <span className="commentDeleteIcon" onClick={handleCommentDelete}>
          {commentOwner._id == currentUser._id && <DeleteOutlineOutlined />}
        </span>
      </div>
      <div className="commenttextWrapper">{comment.commentText}</div>
      <span
        className="commentLikeIcon"
        style={{ cursor: "pointer" }}
        onClick={handleCommentLike}
      >
        {isLiked ? <ThumbUp /> : <ThumbUpOutlined />}
      </span>
      <span className="commentLikes"> {likes} likes</span>
    </div>
  );
}
