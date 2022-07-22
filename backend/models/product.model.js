const mongoose = require('mongoose'); 

const Schema = mongoose.Schema; 

const productSchema = new Schema({ 
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        minlength: 5
    }
}, { 
    timestamps: true,
})

const Product = mongoose.model('Product', productSchema); 
module.exports = Product; 