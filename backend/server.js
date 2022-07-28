const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { google } = require("googleapis");
const cors = require('cors'); 
app.use(cors()); 

require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./firebase-admin.json");

const googleOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  ""
);

const uri = process.env.ATLAS_URI;  

//setting up database 
mongoose.connect(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("MongoDb Connected successfully");
});

const productsRouter = require('./routes/products');
app.use('/products', productsRouter); 


//for oauth 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://team-tdw-default-rtdb.firebaseio.com",
});

// middleware to verify request from frontend are from a registered firstbase user
const verifyFirebaseTokenMiddleware = (req, res, next) => {
  let authToken = req.headers["authorization"];
  if (authToken) {
    authToken = authToken.replace("Bearer ", "");
    getAuth()
      .verifyIdToken(authToken)
      .then((decodedToken) => {
        req.uid = decodedToken.uid;
        req.authToken = authToken;
        next();
      })
      .catch((error) => {
        return res.status(404).json({ error: "User not found with token" });
      });
  } else {
    return res.status(401).json({ error: "No authorization token provided" });
  }
};

const http = require("http");
const PORT = process.env.PORT || 5000;

server = http.createServer(app);

const io = require("socket.io")(server);

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.get("/", function (req, res, next) {
  res.json(req.body);
  next();
});

app.post("/api/tasks/google_calendar", async function (req, res, next) {
  let authToken = req.headers["authorization"];
  if (!authToken) {
    return res.status(401).json({ error: "No authorization token provided" });
  }
  if (!authToken.startsWith("Bearer ")) {
    return res
      .status(409)
      .json({ error: "Authorization is not a bearer token" });
  }
  authToken = authToken.replace("Bearer ", "");
  googleOAuth2Client.setCredentials({ refresh_token: authToken });

  // TODO: make this into a worker
  // TODO: details of the actual event should come from database
  let googleResponse = null;
  try {
    googleResponse = await google.calendar("v3").events.insert({
      auth: googleOAuth2Client,
      calendarId: "primary",
      requestBody: {
        start: {
          dateTime: new Date(),
        },
        end: {
          dateTime: new Date(Date.now() + 60 * 60 * 1000),
        },
        description: "placeholder description",
      },
    });
    if (googleResponse.status === 200) {
      return res
        .status(200)
        .json({ message: "successfully created google event" });
    }
  } catch (err) {
    return res
      .status(err.response.status)
      .json({ error: err.response.statusText });
  }
  next();
});

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