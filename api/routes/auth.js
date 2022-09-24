const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const isDuplicateUsername = await User.findOne({
      username: req.body.username,
    });
    const isDuplicateEmail = await User.findOne({ email: req.body.email });

    if (!isDuplicateUsername && !isDuplicateEmail) {
      //create new user
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user);
      return;
    } else {
      res.status(403).json("entered username or email already exist");
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const hashPassword = req.body.Hashedpassword;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json("user not found");
      return;
    }
    // const validPassword = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );

    if (user.password == hashPassword) {
      res.status(200).json(user);
      return;
    } else {
      res.status(403).json("wrong credentials!");
    }
    // if (!validPassword) {
    //   res.status(400).json("wrong password");
    //   return;
    // }

    // res.status(200).json(user);
    // return;
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

module.exports = router;
