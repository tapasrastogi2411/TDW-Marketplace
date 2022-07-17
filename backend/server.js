const express = require("express");
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

const http = require("http");
const PORT = 5000;

server = http.createServer(app);

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.get("/", function (req, res, next) {
  res.json(req.body);
  next();
});

const io = require("socket.io")(server);

let auctionToUser = {};

let userToAuction = {};

io.on("connection", (socket) => {
  socket.on("joinRoom", (auctionId) => {
    if (!auctionToUser[auctionId]) {
      auctionToUser[auctionId] = [];
    }
    const maxConnections = 10;
    if (auctionToUser[auctionId].length >= maxConnections) {
      return socket.emit("auctionFull");
    }
    auctionToUser[auctionId].push(socket.id);
    userToAuction[socket.id] = auctionId;
    const otherUsersInAuction = auctionToUser[auctionId].filter(
      (userId) => userId !== socket.id
    );
    socket.emit("otherUsersInAuction", otherUsersInAuction);
  });

  socket.on("sendingSignal", (data) => {
    io.to(data.userToSignal).emit("userJoinedAuction", {
      signal: data.signal,
      userJoined: data.userJoined,
    });
  });

  socket.on("receivedSignal", (data) => {
    io.to(data.userJoined).emit("gotSignal", {
      signal: data.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const auctionId = userToAuction[socket.id];
    let users = auctionToUser[auctionId];
    const userIndex = users ? users.indexOf(socket.id) : -1;
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      auctionToUser[auctionId] = users;
      // TODO: send another signal telling to update the new users
    }
  });
});

server.listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
