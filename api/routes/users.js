const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//profile image route
router.post("/updateProfileImg/:id", async (req, res) => {
  try {
    const url = req.body.ProfileUrl;
    const res = await User.findByIdAndUpdate(req.params.id, {
      $set: { profilePicture: url },
    });
    res.status(200).json("profile picture added");
  } catch (err) {
    res.status(500).json(err);
  }
});

//update profile
router.post("/update/profile/:userId", async (req, res) => {
  const status = req.body.status;
  const bio = req.body.bio;
  const currentCity = req.body.currentCity;
  const from = req.body.from;
  const coverPicture = req.body.coverPicture;
  const profilePicture = req.body.profilePicture;
  try {
    const rs = await User.updateOne(
      { _id: req.params.userId },
      {
        $set: {
          relationship: status,
          desc: bio,
          city: currentCity,
          from: from,
          coverPicture: coverPicture,
          profilePicture: profilePicture,
        },
      }
    );
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json("error is" + err);
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a user with hashed password
router.post("/user/ForgotPassword", async (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  try {
    const user = await User.findOne({ username: username });
    if (email == user.email) {
      const { password, ...other } = user;
      res.status(200).json(password);
      return;
    } else {
      res.status(403).json("unauthenticated");
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get followers
router.get("/followers/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followers.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let followerList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      followerList.push({ _id, username, profilePicture });
    });
    res.status(200).json(followerList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

//bookmark a post
router.post("/bookmark/:postId", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (!user.Bookmarks.includes(req.params.postId)) {
      const rs = await User.findByIdAndUpdate(userId, {
        $push: { Bookmarks: req.params.postId },
      });

      res.status(200).json(rs);
      return;
    }

    res.status(403).json("you already bookmarked this post");
    return;
  } catch (err) {
    res.status(500).json(err);
  }
});

//unBookmark a post
router.post("/unBookmark/:postId", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    if (user.Bookmarks.includes(req.params.postId)) {
      const rs = await User.findByIdAndUpdate(userId, {
        $pull: { Bookmarks: req.params.postId },
      });

      res.status(200).json(rs);
      return;
    }
    res.status(403).json("you already unBookmarked this post");
    return;
  } catch (err) {
    res.status(500).json(err);
  }
});

//is post bookmarked
router.get("/isBookmarked/:postId/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user.Bookmarks.includes(req.params.postId)) {
      res.status(200).json("bookmarked");
    } else {
      res.status(200).json("not bookmarked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get bookmarks
router.get("/getBookmarks/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user.Bookmarks);
    return;
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json("some error occured");
  }
});

module.exports = router;
