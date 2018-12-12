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

router.get("/users", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        users: allUsers
      });
    }
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
        { expiresIn: "15m" },
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

router.post("/token", verifyToken, (req, res) => {
  const { username } = req.body;
  const user = {
    username: username
  };
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      jwt.sign({ user }, "secretkey", { expiresIn: "15m" }, (err, token) => {
        res.json({
          message: "Token Refreshed",
          token
        });
      });
    }
  });
});

// Token Format
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

app.use("/api", router);
app.listen(4000, () => console.log("Server started on port 4000"));
