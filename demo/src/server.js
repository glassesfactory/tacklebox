const express = require("express");
const http = require("http");

const app = express();

app.get("/demo-api", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3474");
  res.json({
    status: "ok",
  });
});

app.get("/demo-api/:wait", (req, res) => {
  const waitTime =
    Number(req.params.wait) === NaN ? 0 : Number(req.params.wait);
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3474");
  setTimeout(() => {
    res.json({
      status: "ok",
    });
  }, waitTime);
});

http.createServer(app).listen(3000);
console.log("start demo server at", 3000);
