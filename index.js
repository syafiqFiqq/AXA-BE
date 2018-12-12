const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();

app.use(bodyParser.json());

// Set the cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the AXA API"
  });
});

app.use("/api", router);
app.listen(4000, () => console.log("Server started on port 4000"));
