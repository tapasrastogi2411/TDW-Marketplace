const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 5,
    },
    uid: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 5,
    },
    startingBid: {
      type: Number,
      required: false,
      unique: false,
      trim: true,
      minlength: 0,
    },
    description: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 5,
    },
    biddingDate: { 
      type: String, 
      required: true, 
      unique: false, 
      trim: true, 
      minlength: 0, 
    }, 
    roomId: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      minlength: 0, 
    }, 
    roomStatus: { 
      type: Boolean, 
      required: false,
      unique: false, 
      trim: true, 
      minlength: 0, 
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
