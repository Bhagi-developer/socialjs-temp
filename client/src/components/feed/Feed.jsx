import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

export default function Feed({ username, socket, userId }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [refreshNum, setRefreshNum] = useState(0);
  const history = useHistory();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("posts/timeline/" + user?._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user?._id, refreshNum]);

  useEffect(() => {}, []);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user?.username) && (
          <Share username={username} />
        )}
        {posts.length == 0 && (
          <div
            style={{
              color: "gray",
              fontSize: "20px",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            no posts yet
          </div>
        )}
        {username && userId != user._id && !user.followings.includes(userId) ? (
          <>Follow this user to their see posts </>
        ) : (
          posts.map((p) => (
            <Post
              key={p._id}
              post={p}
              setRefreshNum={setRefreshNum}
              socket={socket}
              isProfilePost={username ? true : false}
            />
          ))
        )}
      </div>
    </div>
  );
}
