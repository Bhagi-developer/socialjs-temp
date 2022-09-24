import "./post.css";
import {
  Bookmark,
  BookmarkBorderOutlined,
  CopyrightOutlined,
  Delete,
  FileCopy,
  MoreVert,
  Share,
  ThumbUp,
  ThumbUpOutlined,
} from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./post.css";

export default function Post({ post, setRefreshNum, socket, isProfilePost }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  const textSelection = isProfilePost ? "#1872f2" : "#53975d";

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser?._id));
  }, [currentUser?._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser?._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    try {
      const fetchIsBookmarked = async () => {
        const res = await axios.get(
          `/users/isBookmarked/${post._id}/${currentUser?._id}`
        );
        if (res.data == "bookmarked") {
          setIsBookmarked(true);
        } else if (res.data == "not bookmarked") {
          setIsBookmarked(false);
        }
      };
      fetchIsBookmarked();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handlePostDelete = async () => {
    alert("you sure? the post will be deleted forever!");

    try {
      await axios.delete("/posts/" + post._id + "/" + currentUser?._id);
      await axios.delete("/posts//comments/" + post._id);

      setRefreshNum(Math.random());
    } catch (err) {
      console.log(err);
    }
  };

  const handlePostCopy = () => {
    navigator.clipboard.writeText("localhost:3000/post/" + post._id);
    alert("Link Copied On clipboard.");
  };

  const handleBookmarkCLick = async () => {
    try {
      if (!isBookmarked) {
        await axios.post("/users/bookmark/" + post._id, {
          userId: currentUser?._id,
        });
        setIsBookmarked(true);
      } else {
        await axios.post("/users/unBookmark/" + post._id, {
          userId: currentUser?._id,
        });
        setIsBookmarked(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleNotification = async (type) => {
    socket.current.emit("sendNotification", {
      senderId: currentUser?._id,
      receiverId: user._id,
      type,
    });
  };

  return (
    <div className="post" style={{}}>
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>

          {currentUser?._id == post.userId ? (
            <div
              className="postTopRight"
              onClick={() => {
                handlePostDelete();
              }}
            >
              <Delete />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <span
              className="likeIcon"
              onClick={() => {
                likeHandler();
                isLiked ? handleNotification(5) : handleNotification(1);
              }}
            >
              {isLiked ? <ThumbUp /> : <ThumbUpOutlined />}
            </span>

            <span className="postLikeCounter">
              {like} people like it{" "}
              <Link to={`/post/${post._id}`}>
                <button style={{ cursor: "pointer" }}>View</button>
              </Link>
            </span>
          </div>
          <div className="postBottomRight">
            <span onClick={handlePostCopy} style={{ cursor: "pointer" }}>
              Copy Link
            </span>
            <span
              className="BookmarkPostWrapper"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleBookmarkCLick();
                isBookmarked ? handleNotification(6) : handleNotification(3);
              }}
            >
              {isBookmarked ? <Bookmark /> : <BookmarkBorderOutlined />}
            </span>
            <Link to={`/post/${post._id}`}>
              <span className="postCommentText">comments</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
