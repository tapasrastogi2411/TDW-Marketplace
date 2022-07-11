const express = require("express");
const app = express();
const { google } = require("googleapis");
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./firebase-admin.json");

const googleOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000"
);

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
        return res.status(404).end("User not found with token");
      });
  } else {
    return res.status(401).end("No authorization token provided");
  }
};

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.get("/", function (req, res, next) {
  res.json(req.body);
  next();
});

app.post("/api/tasks/google_calendar", async function (req, res, next) {
  googleOAuth2Client.setCredentials({ refresh_token: req.authToken });
  // TODO: issue here using their refresh token to create event errors out
  // TODO: make this into a worker
  const response = await google.calendar("v3").events.insert({
    auth: googleOAuth2Client,
    calendarId: "primary",
    requestBody: {
      summary: "test summary",
      description: "test description",
      start: {
        dateTime: Date.now(),
      },
      end: {
        dateTime: Date.now() + 100,
      },
    },
  });
  console.log("response? : ", response);
  next();
});

const http = require("http");
const PORT = 5000;

http.createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
