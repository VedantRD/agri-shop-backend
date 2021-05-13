const mongoose = require('mongoose');
const Seller = require('./sellerModel');
const { ObjectId } = mongoose.Schema.Types

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZHVjdHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'
    },
    price: {
        type: Number,
        required: true,
    },
    // discount: {
    //     type: Number,
    //     default: 0
    // },
    // highlights: {
    //     type: [String],
    //     required: true,
    // },
    description: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0
    },
    // category: {
    //     type: String,
    //     required: true
    // },
    ownedBy: {
        type: ObjectId,
        ref: Seller,
        required: true
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;