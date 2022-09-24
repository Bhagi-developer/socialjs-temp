import { Link } from "react-router-dom";
import "./homeRightFollowing.css";

export default function HomeRightFollowing({ user, onlineUsers }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <Link
      to={`/profile/${user.username}`}
      style={{ textDecoration: "none", color: "black" }}
    >
      <li className="rightbarFriend">
        <div className="rightbarProfileImgContainer">
          <img
            className="rightbarProfileImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <span className="rightbarOnline"></span>
        </div>
        <span className="rightbarUsername">{user.username}</span>
        <span>{onlineUsers?.includes(user._id) && " (🟢Online)"}</span>
      </li>
    </Link>
  );
}
