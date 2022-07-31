const { getAuth } = require("firebase-admin/auth");

// middleware to verify request from frontend are from a registered firstbase user
module.exports = {
  verifyFirebaseTokenMiddleware: (req, res, next) => {
    let authToken = req.headers["authorization"];
    if (authToken) {
      authToken = authToken.replace("Bearer ", "");
      getAuth()
        .verifyIdToken(authToken)
        .then((decodedToken) => {
          req.user = decodedToken;
          next();
        })
        .catch((error) => {
          return res.status(404).json({ error: "User not found with token" });
        });
    } else {
      return res.status(401).json({ error: "No authorization token provided" });
    }
  },
};
