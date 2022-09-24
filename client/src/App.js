import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Users from "./pages/users/Users";
import UpdateProfile from "./pages/updateProfile/UpdateProfile";
import ForgotPasswordForm from "./pages/forgotPasswordForm/ForgotPasswordForm";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import Bookmarks from "./components/bookmarks/Bookmarks";
import { io } from "socket.io-client";
import SignlePost from "./pages/singlePostPage/SignlePost";

function App() {
  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
  }, []);

  const { user } = useContext(AuthContext);
  useEffect(() => {
    socket.current?.emit("addUser", user?._id);
    socket.current?.on("getUsers", (users) => {
      setOnlineUsers(
        user?.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });
  }, [user]);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? (
            <Home socket={socket} onlineUsers={onlineUsers} />
          ) : (
            <Register />
          )}
        </Route>
        <Route exact path="/:username/bookmarks">
          <Bookmarks socket={socket} />
        </Route>
        <Route exact path="/users/all">
          {user ? <Users socket={socket} /> : <Register />}
        </Route>
        <Route path="/login">
          {user ? (
            <Redirect to="/" socket={socket} onlineUsers={onlineUsers} />
          ) : (
            <Login />
          )}
        </Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/messenger">
          {!user ? (
            <Redirect to="/" socket={socket} onlineUsers={onlineUsers} />
          ) : (
            <Messenger socket={socket} onlineUsers={onlineUsers} />
          )}
        </Route>
        <Route exact path="/profile/:username">
          {user ? <Profile socket={socket} /> : <Register />}
        </Route>
        <Route path="/post/:postId">
          <SignlePost socket={socket} />
        </Route>
        <Route path="/profile/update/:userId">
          <UpdateProfile socket={socket} />
        </Route>
        <Route path="/forgotPassword">
          <ForgotPasswordForm socket={socket} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
