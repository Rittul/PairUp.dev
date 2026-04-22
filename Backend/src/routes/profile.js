const express = require("express");
const profileRouter = express.Router();
const User = require("../models/users");
const connection = require("../models/connections");
const userauth = require("../middlewares/auth");

profileRouter.get("/profile", userauth, async (req, res) => {
  try {
    const userid = req.user;
    const user = await User.findOne({ _id: userid }).select(
      "username emailId gender age skills about photourl",
    );
    if (!user) throw new Error("uer not found");
    res.json({ user });
  } catch (err) {
    res.send(err.message);
  }
});

profileRouter.patch("/update/profile", userauth, async (req, res) => {
  try {
    const userid = req.user;
    const user = await User.findOne({ _id: userid });
    if (!user) throw new Error("no user found");
    const allowedUpdates = [
      "username",
      "age",
      "gender",
      "photourl",
      "skills",
      "about",
    ];
    const updates = Object.keys(req.body);
    const isvalidUpdates = updates.every((field) => {
      return allowedUpdates.includes(field);
    });
    if (!isvalidUpdates) {
      return res.send("invalid updates!.....");
    }
    updates.forEach((it) => {
      user[it] = req.body[it];
    });
    await user.save();
    res.json({ user });
  } catch (err) {
    return res.send(err.message);
  }
});

profileRouter.get("/feed", userauth, async (req, res) => {
  try {
    const loggedinuserid = req.user;
    const connections = await connection.find({
      $or: [{ touserId: loggedinuserid }, { fromuserId: loggedinuserid }],
    });
    const hiddenUsers = connections.map((conn) => {
      return conn.fromuserId.toString() === loggedinuserid.toString()
        ? conn.touserId
        : conn.fromuserId;
    });
    hiddenUsers.push(loggedinuserid);
    const feeds = await User.aggregate([
      {
        $match: {
          _id: { $nin: hiddenUsers },
        },
      },
      {
        $sample: { size: 10 },
      },
      {
        $project: {
          username: 1,
          about: 1,
          photourl: 1,
          skills: 1,
        },
      },
    ]);
    res.json({ feeds });
  } catch (err) {
    console.log(err.message);
    res.send("something went wrong!..");
  }
});


module.exports = profileRouter;
