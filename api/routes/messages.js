const router = require("express").Router();
const Message = require("../models/Message");

//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update messages
router.put("/:messageId", async (req, res) => {
  try {
    const mId = req.params.messageId;
    const rs = await Message.deleteOne({ _id: mId });
    res.status(200).json("message deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//like or dislike a message
router.put("/like/:messageId", async (req, res) => {
  try {
    const isLiked = req.body.isLiked;
    if (isLiked) {
      const rs = await Message.findByIdAndUpdate(req.params.messageId, {
        $set: { isLiked: false },
      });

      res.status(200).json(rs.data);
    } else {
      const rs = await Message.findByIdAndUpdate(req.params.messageId, {
        $set: { isLiked: true },
      });
      res.status(200).json(rs.data);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get is message liked or not
router.get("/like/:messageId", async (req, res) => {
  try {
    const rs = await Message.findById(req.params.messageId);
    res.status(200).json(rs.isLiked);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
