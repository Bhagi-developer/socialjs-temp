import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import Following from "../../components/followings/Following";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Messenger({ socket, onlineUsers }) {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [receiverUser, setReceiverUser] = useState("");
  const [buttonText, setButtonText] = useState("write a message");
  const { user } = useContext(AuthContext);
  const scrollRef = useRef();

  useEffect(() => {
    socket.current?.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage == "") {
      return;
    }
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current?.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleclick = async (c) => {
    const receiverId = c.members.filter((uId) => uId != user._id)[0];
    const res = await axios.get("/users?userId=" + receiverId);
    setReceiverUser(res.data);
    setCurrentChat(c);
  };

  const handleMessageDelete = async (mId) => {
    setMessages((messages) => messages.filter((m) => m._id != mId));
    const res = await axios.put("/messages/" + mId);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar socket={socket} isMessanger={true} />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <h3>Your Followings</h3>
            {user.followings.map((fId) => {
              return (
                <Following
                  key={fId}
                  followingdId={fId}
                  setCurrentChat={setCurrentChat}
                  setReceiverUser={setReceiverUser}
                />
              );
            })}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div
                  className="receiverInfo"
                  style={{ backgroundColor: "rgb(170, 105, 0)" }}
                >
                  <Link
                    to={`/profile/${receiverUser.username}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="receiverUsername">
                      {receiverUser.username}
                    </div>
                  </Link>
                  <div className="isOnline">
                    {onlineUsers?.includes(receiverUser._id) ? (
                      <>Online</>
                    ) : (
                      <>not Online</>
                    )}
                  </div>
                </div>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        key={m._id}
                        message={m}
                        own={m.sender === user._id}
                        handleMessageDelete={handleMessageDelete}
                        receiverUsername={receiverUser.username}
                        senderUsername={user.username}
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      setButtonText("send");
                    }}
                    value={newMessage}
                  ></textarea>
                  <button
                    className="chatSubmitButton"
                    onClick={handleSubmit}
                    style={{ backgroundColor: "rgb(170, 105, 0)" }}
                  >
                    {buttonText}
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <div className="onlineUsersContainer">
              <h3>Online (from your followings)</h3>
              <ChatOnline
                onlineUsers={onlineUsers}
                currentId={user._id}
                setCurrentChat={setCurrentChat}
                setReceiverUser={setReceiverUser}
              />
            </div>
            <div className="previousChatsUserContainer">
              <h3>You Previous conversations</h3>
              {conversations.map((c) => (
                <div key={c._id} onClick={() => handleclick(c)}>
                  <Conversation conversation={c} currentUser={user} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
