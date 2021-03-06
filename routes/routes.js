const { User, Message } = require("../models/models.js");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const router = Router();

router.get("/", async function (req, res) {
  let messages = await Message.findAll({});
  let data = { messages };

  res.render("index.ejs", data);
});

//post the likes/dislike count to db
router.post("/", async function (req, res) {
  //get like/dislike counter
  const { statscountlike, statscountdislike } = req.body;

  try {
    //Search table for message and then update likes/dislikes row in table
    let msg = await Message.findAll();
    // Check if record exists in db
    if (msg) {
      //update like/dislike columns
      Message.update(
        {
          likes: statscountlike,
          dislikes: statscountdislike,
        },
        { where: { content: content } }
      );
    } else {
      res.send("Message not found");
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/createUser", async function (req, res) {
  res.render("createUser.ejs");
});

router.post("/createUser", async function (req, res) {
  let { username, password } = req.body;

  try {
    await User.create({
      username,
      password,
      role: "user",
    });
  } catch (e) {
    console.log(e);
  }

  res.redirect("/login");
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/login", async function (req, res) {
  let { username, password } = req.body;

  try {
    let user = await User.findOne({
      where: { username },
    });
    //bug - promise pending finding user in db but not doing anything while waiting
    //moved ifelse block into try block
    if (user && user.password === password) {
      let data = {
        username: username,
        role: user.role,
      };

      let token = jwt.sign(data, "theSecret");
      res.cookie("token", token);
      res.redirect("/");
    } else {
      res.redirect("/error");
    }
  } catch (e) {
    console.log(e);
  }
  /*
  if (user && user.password === password) {
    let data = {
      username: username,
      role: user.role,
    };

    let token = jwt.sign(data, "theSecret");
    res.cookie("token", token);
    res.redirect("/");
  } else {
    res.redirect("/error");
  }
  */
});

router.get("/message", async function (req, res) {
  let token = req.cookies.token;

  if (token) {
    // very bad, no verify, don't do this
    res.render("message");
  } else {
    res.render("login");
  }
});

router.post("/message", async function (req, res) {
  let { token } = req.cookies;
  let { content } = req.body;

  if (token) {
    let payload = await jwt.verify(token, "theSecret");

    let user = await User.findOne({
      where: { username: payload.username },
    });

    let msg = await Message.create({
      content,
      userId: user.id,
    });

    res.redirect("/");
  } else {
    res.redirect("/login");
  }
});

router.get("/error", function (req, res) {
  res.render("error");
});

router.all("*", function (req, res) {
  res.send("404 dude");
});

module.exports = router;
