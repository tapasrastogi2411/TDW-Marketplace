const express = require("express");
const app = express();
const { google } = require("googleapis");
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

const serviceAccount = require("./firebase-admin.json");

const cors = require("cors");

const googleOAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  ""
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
        return res.status(404).json({ error: "User not found with token" });
      });
  } else {
    return res.status(401).json({ error: "No authorization token provided" });
  }
};

app.use(cors());

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

const http = require("http");
const PORT = 5000;

http.createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
