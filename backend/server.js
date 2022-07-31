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
const { getAuth } = require("firebase-admin/auth");

const middleware = require("./middleware.js")

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
app.use("/products", productsRouter);

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
  },
}

// create queue for calendar from bullmq
const sendCalendarQueue = new Queue(
  "send google calendar",
  redisConnection
);

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

app.post(
  "/api/user/tasks/send_email",
  middleware.verifyFirebaseTokenMiddleware,
  async function (req, res, next) {
    if (!req.body.subject || !req.body.html) {
      return res.status(400).json({
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

app.post(
  "/api/listings/:listing_id/tasks/google_calendar",
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
    const listingId = req.params.listing_id;

    let product = null;
    try {
      product = await Product.findOne({ _id: listingId });
    } catch (error) {
      res.status(500).json({ error: error.message });
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

io.on("connection", (socket) => {
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

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        io.to(room).emit("userDisconnected", { id: socket.id });
      }
    });
  });

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
