import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

export default function ChatOnline({
  onlineUsers,
  currentId,
  setCurrentChat,
  setReceiverUser,
}) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/friends/" + currentId);
      setFriends(res.data);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  const handleClick = async (receiver) => {
    try {
      const res = await axios.get(
        `/conversations/find/${currentId}/${receiver._id}`
      );
      //if no messages sent
      if (res.data == null) {
        const rs = await axios.post("/conversations", {
          senderId: currentId,
          receiverId: receiver._id,
        });
        setCurrentChat(rs.data);
      }
      //if messages sent previously
      else {
        setCurrentChat(res.data);
      }

      setReceiverUser(receiver);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div
          key={o._id}
          className="chatOnlineFriend"
          onClick={() => handleClick(o)}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? PF + o.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o?.username}</span>
        </div>
      ))}
    </div>
  );
}
