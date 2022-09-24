import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./following.css";

export default function Following({
  followingdId,
  setCurrentChat,
  setReceiverUser,
}) {
  const [followingUser, setFollowingUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user } = useContext(AuthContext);

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const res = await axios.get("/users?userId=" + followingdId);
        setFollowingUser(res.data);
      };
      fetchUser();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleClick = async () => {
    try {
      const res = await axios.get(
        `/conversations/find/${user._id}/${followingUser._id}`
      );
      //if no messages sent
      if (res.data == null) {
        const rs = await axios.post("/conversations", {
          senderId: user._id,
          receiverId: followingUser._id,
        });
        setCurrentChat(rs.data);
      }
      //if messages sent previously
      else {
        setCurrentChat(res.data);
      }

      setReceiverUser(followingUser);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="followingUser" onClick={() => handleClick()}>
        <img
          src={
            followingUser?.profilePicture
              ? PF + followingUser?.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt=""
          className="FollowingUserImg"
        />
        <span className="FollowingUsername">{followingUser?.username}</span>
      </div>
    </div>
  );
}
