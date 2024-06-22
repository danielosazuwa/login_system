const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const _ = require("lodash");
const axios = require("axios");
const session = require("express-session");
const cookies = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const connection = require("./database/connection");
const collection = require("./model/model");
const uploadCollection = require("./model/upload");
dotenv.config({ path: "config.env" });
const app = express();
const port = 3000;

//MongoDB connection
connection();

//convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

//use EJS as a view engine
app.set("view engine", "ejs");

//static file
app.use(express.static("public"));

// Initialization
app.use(cookies());

app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

//Register user
app.post("/signup", async (req, res) => {
  const data = {
    name: _.trim(req.body.username),
    password: _.trim(req.body.password),
  };

  //check if user already exist
  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    res.render("signup", {
      err: "User already exists. Please choose a different name",
    });
  } else {
    //This ensures that the password is at least six characters
    console.log(data.password.length);
    if (data.password.length < 6) {
      console.log("Password is less than 6 characters");
      res.render("signup", { error: "Password is less than 6 characters" });
    } else {
      //hash the password using bcrypt method
      const saltRounds = 10; //Number of salt round for bcrypt
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      data.password = hashedPassword; //Replace the original password with hash password
      const userData = await collection.insertMany(data);
      // console.log(userData);
      res.render("login", { created: "User account successfully created" });
    }
  }
});

//login user
app.post("/login", async (req, res) => {
  try {
    // check for user
    const check = await collection.findOne({ name: _.trim(req.body.username) });
    if (!check) {
      res.send("user does not exist");
    }

    //compare the hash password from database
    const isPasswordMatch = await bcrypt.compare(
      _.trim(req.body.password),
      check.password
    );
    if (isPasswordMatch) {
      req.session.name = check.name;
      var name = req.session.name;
      // console.log(req.session);
      req.session.save();
      console.log("session created");

      res.cookie("userData".name);
      console.log("User Data added to Cookies");
      console.log(req.cookies);
      res.render("home", { username: name });
    } else {
      res.send("wrong password");
    }
  } catch {
    res.render("login", { error: "Invalid username or password" });
  }
});

//logout
app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    console.log("session destroyed");
  });

  res.clearCookie("userData");
  console.log("Cookies Cleared");
  res.redirect("/");
});

app.get("/allusers", (req, res) => {
  collection
    .find()
    .then((user) => {
      res.render("allusers", { users: user });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error occurred while retrieving user information",
      });
    });
});

app.get("/update-user", (req, res) => {
  const id = req.query.id;
  collection
    .findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "User not found" });
      } else {
        res.render("update-users", { data: data });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error occurred while retrieving user information",
      });
    });
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

//save uploaded files to mongodb database
app.post("/upload", async (req, res) => {
  const uploadedFiles = {
    file: _.trim(req.body.myFile),
    brand: _.trim(req.body.brand),
    price: _.trim(req.body.price),
  };

  const uploaded = await uploadCollection.insertMany(uploadedFiles);
  console.log(uploaded);
  // console.log(userData);
  // res.render("login", { created: "User account successfully created" });
  res.send("files have been uploaded");
});
app.listen(port, () => console.log(`server is running at port ${port}`));
