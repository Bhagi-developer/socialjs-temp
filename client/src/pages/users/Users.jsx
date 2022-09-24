import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Topbar from "../../components/topbar/Topbar";
import { format } from "timeago.js";
import "./users.css";

export default function Users({ socket }) {
  const [users, setUsers] = useState([]);
  const [queryUser, setQueryUser] = useState([]);
  const [isQueried, setIsQueried] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    try {
      const fetchUsers = async () => {
        const res = await axios.get("/users/all");
        setUsers(res.data);
      };

      fetchUsers();
    } catch (err) {
      alert("some error occured");
    }
  }, []);

  const handleSeachUserQuery = (e) => {
    e.preventDefault();
    if (searchQuery == "") {
      window.location.reload();
      return;
    }
    const user = users.find((u) => u.username == searchQuery);
    if (user) {
      setIsQueried(true);
      setQueryUser(user);
      return;
    } else if (!user) {
      alert("no user with  " + searchQuery + " username");
    }
  };

  return (
    <div>
      <Topbar socket={socket} />
      <form onSubmit={handleSeachUserQuery}>
        <div className="seachQuery">
          <input
            className="seachUserInput"
            placeholder="Enter Username to Search"
            value={searchQuery}
            onChange={(e) => {
              if (e.target.value == "") {
                setIsQueried(false);
              }
              setSearchQuery(e.target.value);
            }}
          />
          <button type="submit" className="searchQueryButton">
            Search
          </button>
          <button
            style={{ cursor: "pointer", margin: "5px auto", width: "50%" }}
            onClick={(e) => {
              if (searchQuery != "") {
                window.location.reload();
                return;
              }
              e.preventDefault();
            }}
          >
            Reset
          </button>
        </div>
      </form>
      <div className="users">
        {isQueried ? (
          <>
            {" "}
            <Link
              to={`/profile/${queryUser.username}`}
              style={{ textDecoration: "none" }}
            >
              <div className="user">
                <div className="imgContainer">
                  <img
                    className="UserImg"
                    src={
                      queryUser?.profilePicture
                        ? PF + queryUser.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                  />
                </div>
                <span className="username">{queryUser?.username}</span>
                <span className="userJoined">
                  {" "}
                  (Joined {format(queryUser.createdAt)})
                </span>
              </div>
            </Link>
          </>
        ) : (
          users.map((u) => (
            <Link
              to={`/profile/${u.username}`}
              style={{ textDecoration: "none" }}
            >
              <div className="user">
                <div className="imgContainer">
                  <img
                    className="UserImg"
                    src={
                      u?.profilePicture
                        ? PF + u.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                  />
                </div>
                <span className="username">{u?.username}</span>
                <span className="userJoined">
                  {" "}
                  (Joined {format(u.createdAt)})
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
