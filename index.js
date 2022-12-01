const express = require("express");
const app = express();
const cors = require("cors");
const User = require("./models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
app.use(cors());
app.use(express.json());
var MongoClient = require("mongodb").MongoClient;
var dburl = "mongodb://0.0.0.0:27017/full-mern-stack-project";
const mongoose = require("mongoose");
mongoose
  .connect(
    dburl,
    {
      useNewURLParser: true,
      useUnifiedTopology: true,
    },
    6000000
  )

  .then(console.log("connected to server"))
  .catch((err) => console.log(err));

app.post("/api/register", async (req, res) => {
  console.log("request . body ", req.body);
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let user = await User.insertMany({
      name: name,
      email: email,
      password: hashedPassword,
    })
      .then((resp) => {
        return res.json(resp);
      })
      .catch((err) => {
        return res.json({ status: "ok" });
      });
  } catch (err) {
    console.log(err);
    res.json({ status: "error", error: "Duplicate Email" });
  }
});
// login route

app.post("/api/login", async (req, res) => {
  console.log("request . body ", req.body);
  const { email, password } = req.body;

  let user = await User.findOne({
    email: email,
  });
  if (!user) {
    return res.json({ status: "error", error: "Invalid login Credentials" });
  }
  const isPassWordIsValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPassWordIsValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secretcode123"
    );
    res.set("x-access-token",token)
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.listen(1337, () => {
  console.log("server started on port 1337");
});
