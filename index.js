const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const router = express.Router();

app.use(bodyParser.json());

// Set the cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

//Read data from json
const userDB = fs.readFileSync("db.json");
const allUsers = JSON.parse(userDB).users;

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the AXA API"
  });
});

router.get("/users", (req, res) => {
  res.json({
    users: allUsers
  });
});

router.post("/auth", (req, res, next) => {
  const { username, password } = req.body;
  const user = {
    username: username
  };
  for (var index in allUsers) {
    if (
      username === allUsers[index].username &&
      password === allUsers[index].password
    ) {
      jwt.sign(
        { username: allUsers[index].username },
        "secretkey",
        { expiresIn: "15s" },
        (err, token) => {
          res.json({
            token
          });
        }
      );
      return;
    }
  }
  res.status(401).json({
    token: null,
    err: "Username or password is incorrect"
  });
});

app.use("/api", router);
app.listen(4000, () => console.log("Server started on port 4000"));
