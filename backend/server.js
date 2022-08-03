const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { google } = require("googleapis");
const cors = require("cors");
app.use(cors());

require("dotenv").config();

const sgMail = require("@sendgrid/mail");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const admin = require("firebase-admin");

const middleware = require("./middleware.js");

const { Queue, QueueScheduler, Worker } = require("bullmq");

const serviceAccount = require("./firebase-admin.json");

let Product = require("./models/product.model");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const googleOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  ""
);

const uri = process.env.ATLAS_URI;

//setting up database
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("MongoDb Connected successfully");
});

const productsRouter = require("./routes/products");
app.use("/api/products", productsRouter);

//for oauth
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://team-tdw-default-rtdb.firebaseio.com",
});

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

const redisConnection = {
  connection: {
    host: process.env.REDIS_HOST || "redis",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
};

// create queue for calendar from bullmq
const sendCalendarQueue = new Queue("send google calendar", redisConnection);

// create queue scheduler from bullmq
new QueueScheduler("send google calendar", redisConnection);

// job to send calendar event
const sendGoogleCalendar = async (job) => {
  googleOAuth2Client.setCredentials({ refresh_token: job.data.refreshToken });
  const listing = job.data.listing;
  try {
    googleResponse = await google.calendar("v3").events.insert({
      auth: googleOAuth2Client,
      calendarId: "primary",
      requestBody: {
        start: {
          dateTime: new Date(listing.biddingDate),
        },
        end: {
          dateTime: new Date(
            new Date(listing.biddingDate).getTime() + 60 * 60 * 1000
          ),
        },
        description: `${listing.description}, starting bid ${listing.startingBid}`,
        summary: `${listing.name}'s auction event`,
      },
    });
    if (googleResponse.status !== 200) {
      return new Error("google response failed: ", googleResponse.status);
    }
  } catch (err) {
    return new Error(err);
  }
};

// queue scheduler will use worker to send calendar
new Worker("send google calendar", sendGoogleCalendar, redisConnection);

// create queue for sending calendar events from bullmq
const sendEmailQueue = new Queue("send email", redisConnection);

// create queue scheduler from bullmq
new QueueScheduler("send email", redisConnection);

// job to send email
const sendEmail = async (job) => {
  await sgMail.send(job.data).then(
    () => {},
    (error) => {
      return new Error(error);
    }
  );
};

new Worker("send email", sendEmail, redisConnection);

/* Takes in a subject and body html that will be used for the email being sent with sengrid, the work to all the 
sendgrid api added to the send email queue that will be picked up by a worker after the specified delay time, and 
retry the job with exponential backoff if it fails */
app.post(
  "/api/user/tasks/send_email",
  middleware.verifyFirebaseTokenMiddleware,
  async function (req, res, next) {
    if (!req.body.subject || !req.body.html) {
      return res.status(422).json({
        error:
          "Missing at least one of these body parameters: 'subject' or 'html'",
      });
    }
    sendEmailQueue.add(
      "send email",
      {
        to: req.user.email,
        from: process.env.SENDGRID_EMAIL,
        subject: req.body.subject,
        html: req.body.html,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 10000 },
        delay: 20000,
      }
    );
    res.status(200).json({ status: "email scheduled to send" });
  }
);

/*
Takes in a bearer authorization token thats their google oauth token, finds the appropriate product object
adds to send calendar queue to be executed by a worker afterwards with delay specified and retry with exponential backoff if failed
*/
app.post(
  "/api/products/:product_id/tasks/google_calendar",
  async function (req, res, next) {
    let authToken = req.headers["authorization"];
    if (!authToken) {
      return res.status(401).json({ error: "No authorization token provided" });
    }
    if (!authToken.startsWith("Bearer ")) {
      return res
        .status(409)
        .json({ error: "Authorization is not a bearer token" });
    }
    const productId = req.params.product_id;

    let product = null;
    try {
      product = await Product.findOne({ _id: productId });
      if (product === null) {
        return res.status(404).json({ error: "Product not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
    authToken = authToken.replace("Bearer ", "");
    sendCalendarQueue.add(
      "send google calendar",
      { refreshToken: authToken, listing: product },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 10000 },
        delay: 10000,
      }
    );
    res.status(200).json({ status: "scheduled creation for calendar event" });
  }
);

const http = require("http");
const PORT = process.env.PORT || 5000;

httpServer = http.createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: process.env.SOCKET_ORIGIN,
    methods: ["GET", "POST"],
  },
});
const createAdapter = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const pubClient = createClient({ url: process.env.REDIS_URL + ":6379" });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
});

//Establishes a socket connection.
io.on("connection", (socket) => {
  /**
   * When user joins a room, checks whether its full (> 5 people in room) and emits appropriate auction full signal.
   * Otherwise, adds user to the socket room, and emits a signal with the other users in the room as data.
   */
  socket.on("joinRoom", async (auctionId) => {
    const otherUsersInAuction = await io.in(auctionId).fetchSockets();
    if (otherUsersInAuction.length >= 6) {
      socket.emit("auctionFull");
    } else {
      socket.join(auctionId);
      let listUsers = [];
      otherUsersInAuction.forEach((user) => {
        if (user.id !== socket.id) {
          listUsers.push(user.id);
        }
      });
      socket.emit("otherUsersInAuction", listUsers);
    }
  });

  /**
   * When user receives the other users in their room after joining, adds the others in the room as peers and emits a
   * signal to each one, so they add the new joined user as a peer.
   */
  socket.on("sendingSignal", (data) => {
    io.to(data.userToSignal).emit("userJoinedAuction", {
      signal: data.signal,
      userJoined: data.userJoined,
    });
  });

  /**
   * Upon receiving a return signal from the other users in the room, the new user joining, emits a signal to notify
   * them that a connection has been established.
   */
  socket.on("receivedSignal", (data) => {
    io.to(data.userJoined).emit("gotSignal", {
      signal: data.signal,
      id: socket.id,
    });
  });

  /**
   * When a user disconnects, the user is removed from the room and a signal is emitted to others in the room so they
   * remove the disconnected user as a peer from their peer list.
   */
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        io.to(room).emit("userDisconnected", { id: socket.id });
      }
    });
  });

  /**
   * When a user disconnects all, the other users in the room are manually disconnected by sending them an appropriate signal.
   */
  socket.on("disconnectAll", async (data) => {
    const otherUsersInAuction = await io.in(data.auctionId).fetchSockets();
    otherUsersInAuction.forEach((user) => {
      if (user.id !== socket.id) {
        io.to(user.id).emit("manualDisconnect");
      }
    });
  });
});

httpServer.listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
