const express = require("express");
const app = express();
const route = require("./router");
const bodyParser = require("body-parser");

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(route);

app.get("/", (req, res) => {
  res.end("just testing whether the server is working");
});

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
