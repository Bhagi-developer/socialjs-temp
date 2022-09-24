import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import BookmarkPost from "../bookmarkPost/BookmarkPost";
import Topbar from "../topbar/Topbar";

export default function Bookmarks({ socket }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [reversed, setReversed] = useState([]);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    try {
      const fetchBookmarks = async () => {
        const res = await axios.get("/users/getBookmarks/" + currentUser._id);
        setBookmarks(res.data);
        setReversed(res.data.reverse());
      };
      fetchBookmarks();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div>
      <Topbar socket={socket} />
      {bookmarks.length != 0 && (
        <h3 style={{ color: "gray", textAlign: "center" }}>
          Sorted as your latest Bookmarks
        </h3>
      )}

      {bookmarks.length != 0 ? (
        reversed.map((pId) => {
          return <BookmarkPost key={pId} postId={pId} />;
        })
      ) : (
        <h3 style={{ fontSize: "30px", color: "gray", textAlign: "center" }}>
          No bookmarks
        </h3>
      )}
    </div>
  );
}
