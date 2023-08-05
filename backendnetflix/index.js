require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
mongoose
  .connect("mongodb://localhost:27017/somildata", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("succesful");
  })
  .catch((err) => {
    console.log(err);
  });
const App = express();
var msg;
App.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
App.use(bodyParser.json());
var schema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email",
      isAsync: false,
    },
  },
  password: {
    type: String,
  },
});
var model = new mongoose.model("netflix", schema);
// console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID)
// App.post("/api/v1/auth/google", async (req, res) => {
//     try {
//         console.log("hi");
//         const { token } = req.body
//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: process.env.REACT_APP_GOOGLE_CLIENT_ID
//         });
//         const { name, email, picture } = ticket.getPayload();
//         console.log("login succesfully");

//         res.status(201)

//     }
//     catch {
//         console.log("did not login succesfully")
//     }
// })
App.post("/signup", async (req, res) => {
  try {
    console.log(req.body.password);
    console.log(req.body.email);
    var passhash = await bcrypt.hash(req.body.password, 10);
    var m = new model({ email: req.body.email, password: passhash });
    console.log(passhash);
    let result = await m.save();
    console.log(res.statusCode);
    res
      .status(201)
      .json({ message: "user registered succesfully", a: "Sasaas" });
  } catch {
    //console.log(result.message)
    console.log("error");
  }
});

App.post("/register", async (req, res) => {
  // var c= new model(req.body);
  // var result=await c.save();
  // console.log(req.body);
  // res.send(req.body);}/
  var r = await model.find({ email: req.body.email });
  console.log("register");
  //abcdassd
  if (r.length == 0) {
    console.log("hi");
    res.status(404).json();
  } else {
    console.log(r);
    var p = await bcrypt.compare(req.body.password, r[0].password);
    if (p) {
      res
        .status(201)
        .json({ message: "user registered succesfully", a: "Sasaas" });
    } else {
      res.status(404).json();
    }
  }
});
App.listen(8000);
