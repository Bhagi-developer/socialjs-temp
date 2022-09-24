import { ThumbUp, ThumbUpOutlined } from "@material-ui/icons";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import { format } from "timeago.js";
import Topbar from "../../components/topbar/Topbar";
import Comment from "../../components/comment/Comment";
import { AuthContext } from "../../context/AuthContext";
import "./singlePost.css";

export default function SignlePost({ socket }) {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [refreshCommentRef, setRefreshCommentRef] = useState(0);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  const { postId } = useParams();
  const [like, setLike] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const commentTextInput = useRef();
  const history = useHistory();
  const [isviewLikes, setIsViewLikes] = useState(false);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const post = await axios.get("/posts/" + postId);
        if (post.data == null) {
          history.push("/");
          return;
        }
        setPost(post.data);
        setLike(post.data.likes.length);
        setIsLiked(post.data.likes.includes(currentUser._id));
      };
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchUser = async () => {
        try {
          const user = await axios.get("/users?userId=" + post?.userId);
          setUser(user.data);
        } catch (er) {
          console.log(er);
        }
      };
      fetchUser();
    } catch (err) {
      console.log(err);
    }
  }, [post]);

  useEffect(() => {
    try {
      const fetchComments = async () => {
        const res = await axios.get("/posts/comments/" + post?._id);
        setComments(
          res.data.sort((c1, c2) => {
            return new Date(c2.createdAt) - new Date(c1.createdAt);
          })
        );
      };
      fetchComments();
    } catch (err) {
      console.log(err);
    }
  }, [post, refreshCommentRef]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleNotification = async (type) => {
    socket.current.emit("sendNotification", {
      senderId: currentUser._id,
      receiverId: user._id,
      type,
      url: "/post/" + post._id,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (commentTextInput.current.value == "") {
      return;
    }
    handleNotification(2);

    try {
      await axios.post("/posts/comment/" + post._id, {
        commentUserId: currentUser._id,
        postUserId: post.userId,
        commentText: commentTextInput.current.value,
      });
      setRefreshCommentRef(Math.random());
      commentTextInput.current.value = "";
    } catch (err) {}
  };

  return (
    <div>
      <Topbar socket={socket} />
      <div className="mainDiv">
        <div className="singlePost">
          <div className="singlePostWrapper">
            <div className="singlePostTop">
              <div className="singlePostTopLeft">
                <Link to={`/profile/${user.username}`}>
                  <img
                    className="singlePostProfileImg"
                    src={
                      user.profilePicture
                        ? PF + user.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                  />
                </Link>
                <span className="singlePostUsername">{user.username}</span>
                <span className="singlePostDate">
                  {format(post?.createdAt)}
                </span>
              </div>
            </div>
            <div className="singlePostCenter">
              <span className="singlePostText">{post?.desc}</span>
              <img className="singlePostImg" src={PF + post?.img} alt="" />
            </div>
            <div className="singlePostBottomLeft">
              <span
                className="likeIcon"
                onClick={() => {
                  likeHandler();
                  isLiked ? handleNotification(5) : handleNotification(1);
                }}
              >
                {isLiked ? <ThumbUp /> : <ThumbUpOutlined />}
              </span>

              <span className="singlePostLikeCounter">
                {like} people like it
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="postComment">
        <form className="commentForm" onSubmit={submitHandler}>
          <input
            placeholder={"commment as " + currentUser.username}
            className="commentInput"
            ref={commentTextInput}
          />
          <button className="commentButton" type="submit">
            comment
          </button>
        </form>
      </div>
      <div className="commentsWrapper">
        {comments.length == 0 ? (
          <h3 style={{ color: "gray" }}>No Comments yet</h3>
        ) : (
          <h3 style={{ color: "gray" }}>{comments.length} comments</h3>
        )}
        {comments.map((c) => {
          return (
            <Comment
              key={c._id}
              comment={c}
              setRefreshCommentRef={setRefreshCommentRef}
            />
          );
        })}
      </div>
    </div>
  );
}
