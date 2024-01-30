require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const validator = require("validator");
var bodyParser = require("body-parser");
var bcrypt = require("bcryptjs");
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
    unique: true,
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
App.post("/signup", async (req, res) => {
  try {
    var passhash = await bcrypt.hash(req.body.password, 10);
    var m = new model({ email: req.body.email, password: passhash });
    let result = await m.save();
    console.log(res.statusCode);
    return res.status(201).json({ message: "user registered succesfully" });
  } catch {
    //console.log(result.message)
    console.log("error");
    return res.status(404).json({ message: "error" });
  }
});
App.post("/duplicateentry", async (req, res) => {
  let tuple = await model.findOne({ email: req.body.email });
  console.log(tuple);
  if (tuple != null) {
    return res.status(404).send("duplicate entry");
  }
  return res.send("not duplicate");
});
App.post("/register", async (req, res) => {
  var r = await model.find({ email: req.body.email });
  console.log("register");
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
