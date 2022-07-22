const router = require("express").Router();
let Product = require("../models/product.model");

//Adds product to database
router.route("/addProduct").post(async (req, res) => {
  try {
    var name = req.body.name;
    const newProduct = new Product({
      name
    });
    const SavedProduct = await newProduct.save();
    res.json(SavedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
