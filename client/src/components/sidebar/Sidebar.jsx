import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
  ViewList,
  Visibility,
} from "@material-ui/icons";
import { Users } from "../../dummyData";
import CloseFriend from "../closeFriend/CloseFriend";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "timeago.js";

export default function Sidebar({ username }) {
  const [allUsers, setAllUsers] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    try {
      const fetchAllUsers = async () => {
        const res = await axios.get("/users/all");
        setAllUsers(res.data);
      };
      fetchAllUsers();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const viewColor = username ? "#1872f2" : "#008080";

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <h3>All users</h3>
        {allUsers.map((u) => (
          <div>
            <div className="sidebarListItem">
              <img
                src={
                  u.profilePicture
                    ? PF + u.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
                className="sidebarImg"
              />
              <span className="rightbarFollowingName">{u.username}</span>
              <Link
                to={"/profile/" + u.username}
                style={{ textDecoration: "none", marginLeft: "10px" }}
              >
                <Visibility style={{ color: viewColor }} />
              </Link>
              <br />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
