const express = require("express")

const Product = require("../../models/productModel");

const router = express.Router();

// get all products 
router
    .route('/products')
    .get(async (req, res) => {

        await Product
            .find({}, { __v: 0 })
            .then((products) => {
                res.json({
                    status: "success",
                    message: "All products",
                    length: products.length,
                    products: products
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })

module.exports = router