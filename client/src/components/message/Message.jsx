import "./message.css";
import { format } from "timeago.js";
import {
  Delete,
  ThumbDownSharp,
  ThumbUp,
  ThumbUpAltOutlined,
} from "@material-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Message({
  message,
  own,
  handleMessageDelete,
  receiverUsername,
  senderUsername,
}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [isMessageLiked, setIsMessageLiked] = useState(false);

  const handleMessageLikeClick = async () => {
    setIsMessageLiked(!isMessageLiked);
    try {
      const res = await axios.put("/messages/like/" + message._id, {
        isLiked: isMessageLiked,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchIsMessageLiked = async () => {
      try {
        const res = await axios.get("/messages/like/" + message._id);
        setIsMessageLiked(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchIsMessageLiked();
  }, []);

  const handleDelete = async (mId) => {
    const accept = window.confirm(
      "you sure? This message will be deleted for everyOne!"
    );
    if (accept) {
      handleMessageDelete(mId);
    }

    return;
  };

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {own ? (
          <span>
            <Delete
              className="deleteMessageIcon"
              onClick={() => {
                handleDelete(message._id);
              }}
            />
          </span>
        ) : (
          <></>
        )}
        <p
          className="messageText"
          style={{ backgroundColor: !own && "rgb(170, 105, 0)" }}
        >
          {message.text}
        </p>
      </div>
      <div className="messageBottom">
        {format(message.createdAt)}
        <span
          className="MessageThumbsDiv"
          onClick={() => {
            handleMessageLikeClick();
          }}
          style={{ cursor: "pointer" }}
        >
          {own ? <></> : isMessageLiked ? <ThumbUp /> : <ThumbUpAltOutlined />}
        </span>
        <div className="messageLikedInfo" style={{ color: "gray" }}>
          {isMessageLiked ? (
            own ? (
              <>liked by {receiverUsername}</>
            ) : (
              <>liked by {senderUsername}</>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
