const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});
//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      await User.updateMany(
        {},
        { $pull: { Bookmarks: { $in: req.params.id } } }
      );
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete all post comments
router.delete("/comments/:id", async (req, res) => {
  try {
    await Comment.deleteMany({ postId: req.params.id });
    res.status(200).json("the comments has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id/:userId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.params.userId) {
      await post.deleteOne();
      await User.updateMany(
        {},
        { $pull: { Bookmarks: { $in: req.params.id } } }
      );
      res.status(200).json("the post has been deleted");
      return;
    } else {
      res.status(403).json("you can delete only your post");
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//like / dislike a post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//comment on a post
router.post("/comment/:postId", async (req, res) => {
  const commentUserId = req.body.commentUserId;
  const postUserId = req.body.postUserId;
  const commentText = req.body.commentText;
  const postId = req.params.postId;

  const newComment = new Comment({
    postId,
    commentUserId,
    postUserId,
    commentText,
  });
  try {
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a comment
router.delete("/comment/delete/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const rs = await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json("deleted a comment on a post");
    return;
  } catch (err) {
    res.status(500).json(err);
  }
});

//like a comment
router.put("/comment/like/:commentId", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment.likes.includes(req.body.userId)) {
      await comment.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("comment liked");
    } else {
      await comment.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("comment disliked");
    }
  } catch (err) {
    console.log("errrrrrrr" + err);
    res.status(500).json(err);
  }
});
//is comment liked
router.get("/comment/isLiked/:commentId/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (comment.likes.includes(userId)) {
      res.status(200).json("yes");
    } else {
      res.status(200).json("no");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all comments
router.get("/comments/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get no of likes of a comment
router.get("/comment/likesLength/:commentId", async (req, res) => {
  try {
    const comments = await Comment.find({ _id: req.params.commentId });
    console.log(
      "req aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
        comments
    );
    res.status(200).json(comments.likes?.length);
  } catch (err) {
    console.log(
      "req aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
        err
    );
    res.status(500).json(err);
  }
});

//get a post

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
    return;
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
