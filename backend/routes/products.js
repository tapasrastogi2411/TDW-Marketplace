const router = require("express").Router();
let Product = require("../models/product.model");

//Adds product to database
router.route("/addProduct").post(async (req, res) => {
  try {
    var name = req.body.name;
    var uid = req.body.uid; 
    var startingBid = req.body.startingBid; 
    var description = req.body.description; 
    var biddingDate = req.body.biddingDate; 
    var roomId = req.body.roomId; 
    var roomStatus = req.body.roomStatus; 
    const newProduct = new Product({
      name, 
      uid, 
      startingBid, 
      description, 
      biddingDate, 
      roomId, 
      roomStatus
    });
    const SavedProduct = await newProduct.save();
    res.json(SavedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.route("/getProducts").get(async (req, res) => {
  try{ 
    const products = await Product.find({}); 
    res.json(products); 
  }catch(error){ 
    res.status(500).json({error: err.message}); 
  }
});

router.route("/updateProduct").put(async (req, res) => {
  var id = req.body.id;  
  var name = req.body.name;
  var uid = req.body.uid; 
  var startingBid = req.body.startingBid; 
  var description = req.body.description; 
  var biddingDate = req.body.biddingDate; 
  var roomId = req.body.roomId; 
  var roomStatus = req.body.roomStatus; 
  try { 
    const updatedProduct = await Product.updateOne({_id: id}, 
      {
        $set: {roomStatus, name, uid, startingBid, description, biddingDate, roomId}
      })
      res.json(updatedProduct); 
  }
  catch { 
    res.status(500).json({error: err.message}); 
  }
}); 

router.route("/deleteProduct/:id/").delete(async (req, res) => {
  var id = req.params.id;   
  try { 
    const deletedProduct = await Product.deleteOne({_id: id});
    res.json(deletedProduct); 
  }
  catch { 
    res.status(500).json({error: err.message}); 
  }
}); 

module.exports = router;
