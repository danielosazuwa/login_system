const express = require("express");
const route = express.Router();
var users = require("./database");

route.get("/users", (req, res) => {
  res.json({ allUsers: users });
});

route.post("/users", (req, res) => {
  const incomingUser = req.body;
  users.push(incomingUser);
  res.json(users);
});

route.get("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const getUser = users.find((user) => user.id == userId);

  if (!getUser) {
    res.status(500).end("User not found");
  } else {
    res.json({ allUsers: [getUser] });
  }
});

route.put("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const body = req.body;
  const user = users.find((user) => user.id == userId);
  const index = users.indexOf(user);
  if (!user) {
    res.status(500).send("User not found");
  } else {
    const updatedUser = { ...user, ...body };
    users[index] = updatedUser;
    res.send(updatedUser);
  }
});

route.delete("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const newUsers = users.filter((user) => user.id != userId);

  if (!newUsers) {
    res.status(500).end("User not found");
  } else {
    users = newUsers;
    res.send(users);
  }
});
module.exports = route;
