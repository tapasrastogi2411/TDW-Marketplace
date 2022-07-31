const router = require("express").Router();
let Product = require("../models/product.model");
const { getAuth } = require("firebase-admin/auth");

const middleware = require("../middleware.js");

//Adds product to database
router
  .route("/")
  .post(middleware.verifyFirebaseTokenMiddleware, async (req, res) => {
    try {
      var name = req.body.name;
      var uid = req.body.uid;
      var startingBid = req.body.startingBid;
      var description = req.body.description;
      var biddingDate = req.body.biddingDate;
      var roomId = req.body.roomId;
      var roomStatus = req.body.roomStatus;
      var productImage = req.body.productImage;
      const newProduct = new Product({
        name,
        uid,
        startingBid,
        description,
        biddingDate,
        roomId,
        roomStatus,
        productImage,
      });
      const SavedProduct = await newProduct.save();
      res.json(SavedProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.route("/").get(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.route("/room/:roomId").get(async (req, res) => {
  try {
    const product = await Product.findOne({ roomId: req.params.roomId });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router
  .route("/")
  .put(middleware.verifyFirebaseTokenMiddleware, async (req, res) => {
    var id = req.body.id;
    var name = req.body.name;
    var uid = req.body.uid;
    var startingBid = req.body.startingBid;
    var description = req.body.description;
    var biddingDate = req.body.biddingDate;
    var roomId = req.body.roomId;
    var roomStatus = req.body.roomStatus;
    try {
      const updatedProduct = await Product.updateOne(
        { _id: id },
        {
          $set: {
            roomStatus,
            name,
            uid,
            startingBid,
            description,
            biddingDate,
            roomId,
          },
        }
      );
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router
  .route("/:id/")
  .delete(middleware.verifyFirebaseTokenMiddleware, async (req, res) => {
    var id = req.params.id;
    try {
      const deletedProduct = await Product.deleteOne({ _id: id });
      res.json(deletedProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
