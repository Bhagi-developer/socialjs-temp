const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      require: true,
    },
    commentUserId: {
      type: String,
      require: true,
    },
    postUserId: {
      type: String,
      require: true,
    },
    commentText: {
      type: String,
      require: true,
    },
    likes: {
      type: Array,
      default: [],
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
