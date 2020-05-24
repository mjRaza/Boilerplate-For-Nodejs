const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middlewares/requireLogin");
const { JsonWebTokenSecretKey } = require("../keys");
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(422).json({ error: "Please enter all the fields" });
  }

  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exists" });
      }
      bcrypt.hash(password, 12).then((pass) => {
        const user = new User({ email, password: pass, name });
        user
          .save()
          .then(() => res.status(200).json({ message: "Saved Sucessfully" }))
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
});

router.post("/signin", (req, res) => {
  const { password, email } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please enter email and password" });
  }

  User.findOne({ email }).then((userData) => {
    if (!userData) {
      return res.status(422).json({ error: "Invalid email or password" });
    }

    bcrypt
      .compare(password, userData.password)
      .then((didMatch) => {
        if (!didMatch) {
          return res.status(422).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ _id: userData._id }, JsonWebTokenSecretKey);
        return res.json({ token });
      })
      .catch((err) => console.log(err));
  });
});

router.get("/protected", requireLogin, (req, res) => {
  console.log(req);
  //   res.json({ user: req });
});

module.exports = router;
