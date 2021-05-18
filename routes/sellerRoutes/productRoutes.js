const express = require("express")

const Product = require("../../models/productModel");

const router = express.Router();

//get all products for the seller
router
    .route('/:id/products')
    .get(async (req, res) => {
        const { id } = req.params;
        await Product
            .find({ ownedBy: id }, { __v: 0 })
            .populate('ownedBy', { password: 0, __v: 0 })
            .then((products) => {
                res.json({
                    status: 'success',
                    message: 'Seller products fetched successfully',
                    length: products.length,
                    products: products
                })
            })
            .catch(() => {
                res.json({
                    status: 'failed',
                    message: 'Something went wrong',
                })
            })
    })

// add new product to the products collection and also to the seller 
router
    .route('/addproduct')
    .post(async (req, res) => {
        const { name, price, description, quantity, ownedBy } = req.body

        if (!name || !price || !description || !quantity || !ownedBy) {
            return res.json({
                status: 'failed',
                message: 'All fields are required'
            })
        }

        if (!/\d/.test(quantity)) {
            return res.json({
                status: 'failed',
                message: 'Quantity must be number'
            })
        }

        if (!/\d/.test(price)) {
            return res.json({
                status: 'failed',
                message: 'Price must be number'
            })
        }

        await Product
            .create({ name, price, description, ownedBy, quantity })
            .then((product) => {
                res.json({
                    status: 'success',
                    message: 'product added succesfully',
                    product
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })


// Delete the product from products collection and also from seller document
router
    .route('/deleteproduct')
    .post(async (req, res) => {

        const { productId } = req.body

        await Product
            .findByIdAndDelete({ _id: productId })
            .then(() => {
                res.json({
                    status: 'success',
                    message: 'product deleted succesfully'
                })
            })
            .catch((err) => { console.log(err) })
    })

//Modify the product from product collection and also from seller
router
    .route('/updateproduct')
    .post(async (req, res) => {
        const { _id, newProduct } = req.body;
        console.log(_id, newProduct)
        await Product
            .findByIdAndUpdate(_id, newProduct, { new: true })
            .then((product) => {
                res.json({
                    status: 'success',
                    message: 'Product Information updated succesfully',
                    product
                })
            })
            .catch((err) => {
                console.log(err)
            })
    })

module.exports = router;