import "./rightbar.css";
import HomeRightFollowing from "../homeRightFollowing/HomeRightFollowing";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Message, Remove } from "@material-ui/icons";

export default function Rightbar({ user, isHomeRigh, onlineUsers }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [followers, setFollowers] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers?.includes(f._id)));
  }, [friends, onlineUsers]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user?._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }

      setFollowed(currentUser?.followings.includes(user?._id));
    };
    getFriends();

    const getFollowers = async () => {
      try {
        const followerList = await axios.get("/users/followers/" + user?._id);
        setFollowers(followerList.data);
      } catch (err) {}
    };
    getFollowers();
  }, [user]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser?._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser?._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {}
  };

  const handleMessageClick = async () => {
    try {
    } catch (err) {}
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="addContainer">
          <h2> #ad</h2>
          <img
            className="birthdayImg"
            src="https://source.unsplash.com/random/100×100/?laptop"
            alt=""
          />
          <span className="birthdayText">
            we are the <b>xyz pvt.ltd</b> company
          </span>
        </div>
        <img
          className="rightbarAd"
          src="https://source.unsplash.com/random/?company"
          alt="problem occured while diplaying image"
          style={{ cursor: "progress" }}
        />
        <h4 className="rightbarTitle">Your followings</h4>
        <ul className="rightbarFriendList">
          {friends.length == 0 && (
            <div>
              <Link to="/users/all">
                <button className="allUserRouteButton">
                  Explore Users to follow
                </button>
              </Link>
            </div>
          )}
          {friends.map((u) => (
            <HomeRightFollowing
              key={u._id}
              user={u}
              onlineUsers={onlineUsers}
            />
          ))}
        </ul>

        <Link to="/messenger" style={{ textDecoration: "none" }}>
          <button className="messageRouteButton" onClick={handleMessageClick}>
            Interact In Real Time With Your Friends <Message />
          </button>
        </Link>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser?.username && (
          <div>
            <button className="rightbarFollowButton" onClick={handleClick}>
              {followed ? "Unfollow" : "Follow"}
              {followed ? <Remove /> : <Add />}
            </button>
            <Link to="/messenger" style={{ textDecoration: "none" }}>
              <button
                className="rightbarFollowButton"
                onClick={handleMessageClick}
              >
                Message <Message />
              </button>
            </Link>
          </div>
        )}
        {user.username == currentUser?.username ? (
          <Link
            to={`/profile/update/${currentUser?._id}`}
            style={{ textDecoration: "none" }}
          >
            <button className="updateProfileButton">Update Profile</button>
          </Link>
        ) : (
          <></>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">
              <b>{user.city}</b>
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">
              <b>{user.from}</b>
            </span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              <b>{user.relationship}</b>
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User followings</h4>
        <div className="rightbarFollowings">
          {friends.length == 0 && (
            <div style={{ color: "gray", textAlign: "center" }}>
              No followings
            </div>
          )}
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
        <h4 className="rightbarTitle">User followers</h4>
        <div className="rightbarFollowers">
          {followers.length == 0 && (
            <div style={{ color: "gray", textAlign: "center" }}>
              No followers
            </div>
          )}
          {followers.map((follower) => (
            <Link
              to={"/profile/" + follower.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    follower.profilePicture
                      ? PF + follower.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">
                  {follower.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {isHomeRigh ? <HomeRightbar /> : <ProfileRightbar />}
      </div>
    </div>
  );
}
