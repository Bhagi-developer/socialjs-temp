import "./topbar.css";
import {
  Search,
  Person,
  Chat,
  Notifications,
  BookmarkOutlined,
  Visibility,
} from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Topbar({
  socket,
  username,
  isMessanger,
  isUpdateProfile,
}) {
  const [bookmarks, setBookmarks] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [openNotifications, setOpenNotifications] = useState(false);
  const { user } = useContext(AuthContext);
  const [fetchedUser, setFetchedUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useHistory();

  const viewColor = username
    ? "#1872f2"
    : isMessanger
    ? " rgb(170, 105, 0) "
    : isUpdateProfile
    ? "#ff7a7a"
    : "#53975d";

  useEffect(() => {
    socket.current?.on("getNotification", async (data) => {
      const sender = await axios.get("/users?userId=" + data.senderId);
      setNotifications((prev) => [
        ...prev,
        { senderName: sender.data.username, type: data.type, url: data.url },
      ]);
    });
  }, [socket]);

  useEffect(() => {
    socket.current?.on("getMessage", async (data) => {
      const sender = await axios.get("/users?userId=" + data.senderId);
      setNotifications((prev) => [
        ...prev,
        { senderName: sender.data.username, type: 4 },
      ]);
    });

    try {
      const fetchUser = async () => {
        const res = await axios.get("/users?username=" + user.username);
        setFetchedUser(res.data);
      };
      fetchUser();
    } catch (err) {}
  }, []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get("/users/getBookmarks/" + user?._id);
        setBookmarks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBookmarks();
  }, []);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user?._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user?._id]);

  const displayNotification = ({ senderName, type, url }) => {
    let action;

    if (type === 1) {
      action = "Liked your post.";
    } else if (type === 2) {
      action = "Commented your post.";
    } else if (type === 3) {
      action = "Bookmarked your post.";
    } else if (type === 4) {
      action = "messaged you.";
    } else if (type === 5) {
      action = "disliked your post.";
    } else if (type === 6) {
      action = "unBookmarked your post.";
    }

    if (type == 2) {
      return (
        <span className="notification">
          {`${senderName} ${action}`}{" "}
          <Link to={url}>
            <Visibility />
          </Link>
        </span>
      );
    }
    return <span className="notification">{`${senderName} ${action}`}</span>;
  };

  const handleRead = () => {
    setNotifications([]);
    setOpenNotifications(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    history.push("/register");
    window.location.reload();
  };

  return (
    <div className="topbarContainer" style={{ backgroundColor: viewColor }}>
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">SocialJs</span>
        </Link>
      </div>
      {/* <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div> */}
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            <span className="topbarLink">Homepage</span>
          </Link>
          <Link
            to="/users/all"
            style={{ color: "white", textDecoration: "none" }}
          >
            <span className="topbarLink">Whome_to_follow</span>
          </Link>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Link to={`/${user?.username}/bookmarks`}>
              <BookmarkOutlined
                style={{ color: "white", textDecoration: "none" }}
              />
            </Link>
            <span className="topbarIconBadge">{bookmarks.length}</span>
          </div>
          <div className="topbarIconItem">
            <Link
              to="/messenger"
              style={{ color: "white", textDecoration: "none" }}
            >
              <Chat />
            </Link>
            <span className="topbarIconBadge">{conversations.length}</span>
          </div>
          <div
            className="topbarIconItem"
            onClick={() => setOpenNotifications(!openNotifications)}
          >
            <Notifications />
            <span className="topbarIconBadge">{notifications.length}</span>
          </div>
          {openNotifications && (
            <div className="notifications">
              {notifications.map((n) => displayNotification(n))}
              <button className="nButton" onClick={handleRead}>
                mark as read
              </button>
            </div>
          )}
        </div>
        <Link to={`/profile/${user?.username}`}>
          <img
            src={
              fetchedUser?.profilePicture
                ? PF + fetchedUser?.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
        <span style={{ cursor: "pointer" }} onClick={handleLogout}>
          {" "}
          Logout
        </span>
      </div>
    </div>
  );
}
